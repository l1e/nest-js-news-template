import { AdminOpensearchService } from './../admin-opensearch/admin-opensearch.service';
import {
    ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
	Article,
	ArticleOfTheDay,
	ArticleSpecial,
	PublishStatus,
	Requestor,
	ValidationStatus,
} from "./model/article.model";
import { CreateArticleDto } from "./dto/article.create.dto";
import { AdminCategoryService } from "../admin-category/admin-category.service";
import { AdminUserService } from "../admin-user/admin-user.service";
import { Category } from "../admin-category/model/category.model";
import { User } from "../admin-user/model/user.model";
import { isExsistFormat, Media } from "../admin-media/model/media.model";
import { AdminMediaService } from "../admin-media/admin-media.service";
import { UpdateArticleDto } from "./dto/update.article.dto";

import { Op } from 'sequelize';
import { Pagination, SoringArticles, SortByArticles, SortDirection } from './../../utils/types/types';
import { Tag } from '../admin-tag/model/tag.model';
import { AdminTagService } from '../admin-tag/admin-tag.service';

@Injectable()
export class AdminArticleService {
	constructor(
		@InjectModel(Article)
		private readonly articleModel: typeof Article,
		private adminCategoryService: AdminCategoryService,
		private adminUserService: AdminUserService,
		private adminMediaService: AdminMediaService,
        private adminTagService: AdminTagService,
		private adminOpensearchService: AdminOpensearchService,
	) {}

	async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
		let category = await this.adminCategoryService.getCategoryById(
			createArticleDto.categoryId,
			Requestor.ADMIN,
		);

		let userId = await this.adminUserService.findByEmail({
			email: createArticleDto.creatorEmail,
		});

		if (userId) {
			createArticleDto.creatorId = (await userId).id;
		}

		if (!category) {
			throw new NotFoundException(
				`Category with ID ${createArticleDto.categoryId} not found`,
			);
		}

		let media: Media[] = [];
		if (createArticleDto.media && createArticleDto.media.length > 0) {
			media = await Promise.all(
				createArticleDto.media.map(async (mediaId) => {
					const mediaItem = await this.adminMediaService.findOne(
						mediaId,
					);
					if (!mediaItem) {
						throw new NotFoundException(
							`Media with ID ${mediaId} not found`,
						);
					}
					return mediaItem;
				}),
			);
		}

        let tags: Tag[] = [];
		if (createArticleDto.tags && createArticleDto.tags.length > 0) {
			tags = await Promise.all(
				createArticleDto.tags.map(async (tagId) => {
					const tagItem = await this.adminTagService.findOne(
						tagId,
					);
					if (!tagItem) {
						throw new NotFoundException(
							`Tags with ID ${tagId} not found`,
						);
					}
					return tagItem;
				}),
			);
		}

		console.log('createArticle createArticleDto:', createArticleDto)

		let articleToSave = {
			title: createArticleDto.title,
			description: createArticleDto.description,
			publishStatus:
				createArticleDto.publishStatus ?? PublishStatus.DRAFT,
			validationStatus:
				createArticleDto.validationStatus ?? ValidationStatus.PENDING,
			articleOfTheDay:
				createArticleDto.articleOfTheDay ?? ArticleOfTheDay.NO,
			articleSpecial:
				createArticleDto.articleSpecial ?? ArticleSpecial.NO,
			views: createArticleDto.views ?? 0,
			categoryId: createArticleDto.categoryId,
			creatorId: createArticleDto.creatorId,
		}
		console.log('createArticle articleToSave:', articleToSave)

		let article;

		try {
			article = await this.articleModel.create(articleToSave);
		} catch (error) {
			console.error('Sequelize validation error:', error);
			throw new HttpException(
			  "Validation error: " + error.parent.sqlMessage,
			  HttpStatus.BAD_REQUEST,
			);
		}

		if (media.length > 0) {
			await article.$set("media", media); // Assuming a Many-to-Many relationship with media
		}


        if (tags.length > 0) {
			await article.$set("tags", tags); // Assuming a Many-to-Many relationship with media
		}

		const articleSanitized = await this.articleModel.findByPk(article.id, {
			attributes: {
				exclude: ["requestor", "validationStatus", "creatorId"],
			},
			include: [Category, { model: Media, as: "media" }, { model: Tag, as: "tags" }],
		});

		console.log('createArticle article:',article)
		console.log('createArticle process.env.NODE_ENV :',process.env.NODE_ENV )


		if(process.env.NODE_ENV !=='test'){
			await this.trigetToUpdateTalentByIdOpenSearch(article.id);
		}


		return articleSanitized;
	}

	async getArticleById(
		id: number,
		requestor: Requestor,
		creatorEmail?: string,
	): Promise<Article> {
		try {
			// console.log("getArticleById id:", id);
			// console.log("getArticleById requestor:", requestor);

			const whereConditionsForArticle =
				requestor === Requestor.CMS
					? { publishStatus: PublishStatus.PUBLISHED, id: id }
					: { id: id };

			const attributesToExcludeFromMedia =
				requestor === Requestor.CMS
					? ["isPhysicallyExist", "publishStatus", "articleId"]
					: [];

			const attributesToExcludeFromArticle =
				requestor === Requestor.CMS
					? ["requestor", "validationStatus", "categoryId", "creatorId"]
					: [];

			const article = await this.articleModel.findOne({
				where: whereConditionsForArticle,
				attributes: {
					exclude: attributesToExcludeFromArticle,
				},
				include: [
					{
						model: Category,
						as: "category",
					},
					{
						model: User,
						as: "creator",
						attributes: ["id", "email", "firstName", "lastName"],
					},
                    {
                        model: Tag,
                        as: "tags", // Matches the alias in @BelongsToMany
                        through: { attributes: [] }, // Exclude the pivot table fields if not needed
                    },
				],
			});


			if (!article) {
				throw new NotFoundException(`Article with ID ${id} not found`);
			}

			if (requestor !== Requestor.CMS && creatorEmail !== undefined) {
				await this.articleOwnerValidation(
					article,
					requestor,
					creatorEmail,
				);
			}

			if (requestor === Requestor.CMS && creatorEmail === undefined) {
				article.views += 1;
				await article.save();
			}

			// console.log("getArticleById article _1:", article);
			// console.log(
			// 	"getArticleById article?.dataValues _2:",
			// 	article?.dataValues,
			// );

			// console.log("getArticleById typeof article:", typeof article);


			let additionalFilter = article?.dataValues
				? article.toJSON()
				: article;


			delete additionalFilter?.creatorId;
			if (requestor === Requestor.CMS) {
				delete additionalFilter?.creator;
				delete additionalFilter?.category?.publishStatus;
			}

			return additionalFilter;
		} catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND
            ) {
                throw error;
            }


			throw new InternalServerErrorException("Failed to fetch articles");
		}
	}

	async getArticleOfTheDay(requestor: Requestor): Promise<Article> {
        
        try {

            const attributesToExcludeFromMedia =
			requestor === Requestor.CMS
				? ["isPhysicallyExist", "publishStatus", "articleId"]
				: [];

            // const whereConditionsForMedia =
            // 	requestor === Requestor.CMS
            // 		? { isPhysicallyExist: isExsistFormat.YES }
            // 		: {};

            const article = await this.articleModel.findOne({
                where: { articleOfTheDay: ArticleOfTheDay.YES },
                attributes: {
                    exclude: [
                        "requestor",
                        "validationStatus",
                        "categoryId",
                        "publishStatus",
                        "creatorId",
                    ],
                },
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: {
                            exclude: [
                                "publishStatus",
                                "phone",
                                "updatedAt",
                                "createdAt",
                            ],
                        },
                    },
                    {
                        model: User,
                        as: "creator",
                        attributes: {
                            exclude: ["password", "role", "status", "email"],
                        },
                    },
                    {
                        model: Media,
                        as: "media",
                        attributes: {
                            exclude: attributesToExcludeFromMedia,
                        },
                        // where: whereConditionsForMedia,
                    },
                ],
            });

            return article;
        } catch (error) {
            throw new InternalServerErrorException(
                `An error occurred while get special article. ${error}`, 
            );
        }

	}

	async getArticleSpecial(requestor: Requestor): Promise<Article[]> {
        try {

            const attributesToExcludeFromMedia =
			requestor === Requestor.CMS
				? ["isPhysicallyExist", "publishStatus", "articleId"]
				: [];

            const whereConditionsForMedia =
                requestor === Requestor.CMS
                    ? { isPhysicallyExist: isExsistFormat.YES }
                    : {};

            const article = await this.articleModel.findAll({
                where: { articleSpecial: ArticleSpecial.YES },
                attributes: {
                    exclude: [
                        "requestor",
                        "validationStatus",
                        "categoryId",
                        "publishStatus",
                        "creatorId",
                    ],
                },
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: {
                            exclude: ["publishStatus"],
                        },
                    },
                    {
                        model: User,
                        as: "creator",
                        attributes: {
                            exclude: [
                                "password",
                                "role",
                                "status",
                                "email",
                                "publishStatus",
                                "phone",
                                "updatedAt",
                                "createdAt",
                            ],
                        },
                    },
                    {
                        model: Media,
                        as: "media",
                        attributes: {
                            exclude: attributesToExcludeFromMedia,
                        },
                        where: whereConditionsForMedia,
                    },
                    {
                        model: Tag,
                        as: "tags", // Matches the alias in @BelongsToMany
                        through: { attributes: [] }, // Exclude the pivot table fields if not needed
                    },
                ],
            });

            return article;
            
        } catch (error) {
            throw new InternalServerErrorException(
                `An error occurred while get special article. ${error}`, 
            );
        }

	}

	async getAllArticles(
		requestor: Requestor,
		sorting: SoringArticles,
		categoryId: number,
		publisherId: number,
		textToSearch: string,
		minArticleViews: number,
		pagination:Pagination,
	): Promise<{ pagination: any; articles: Article[] }> {
	
		let whereConditionsGeneral = [];
		if (categoryId) whereConditionsGeneral.push({ categoryId });
		if (publisherId) whereConditionsGeneral.push({ creatorId: publisherId });
		if (minArticleViews) whereConditionsGeneral.push({ views: { [Op.gte]: minArticleViews } });
	
		if (textToSearch) {
			whereConditionsGeneral.push({
				[Op.or]: [
					{ title: { [Op.like]: `%${textToSearch}%` } },
					{ description: { [Op.like]: `%${textToSearch}%` } },
				],
			});
		}
	
		const attributesToExcludeFromArticle =
			requestor === Requestor.CMS
				? [
					"publishStatus",
					"categoryId",
					"validationStatus",
				]
				: [];
	
		const attributesToExcludeFromMedia =
			requestor === Requestor.CMS
				? ["isPhysicallyExist", "publishStatus", "articleId"]
				: [];
	
		const whereConditionsForArticle =
			requestor === Requestor.CMS
				? {
					  validationStatus: "approved",
					  publishStatus: "published",
					  [Op.and]: whereConditionsGeneral,
				  }
				: {
					  [Op.and]: whereConditionsGeneral,
				  };
	
		const whereConditionsForMedia =
			requestor === Requestor.CMS
				// ? { isPhysicallyExist: isExsistFormat.YES }
				? {}
				: {};
	
		try {

			const totalArticles = await this.articleModel.findAll({
				where: whereConditionsForArticle,
				include: [
					{
						model: Category,
						as: "category",
						attributes: {
							exclude: ["publishStatus"],
						},
					},
					{
						model: Media,
						as: "media",
						attributes: {
							exclude: attributesToExcludeFromMedia,
						},
						where: whereConditionsForMedia,
					},
                    {
                        model: Tag,
                        as: "tags", // Matches the alias in @BelongsToMany
                        through: { attributes: [] }, // Exclude the pivot table fields if not needed
                    },
                    {
						model: User,
						as: "creator",
						attributes: ["id", "firstName", "lastName"],
					},
				]
				// include: [
				// 	{
				// 		model: Media,
				// 		as: "media",
				// 		where: whereConditionsForMedia,
				// 		required: false,
				// 	},
				// ],
			});
	
			const paginationResult = {
				count: pagination.perPage, //fix it!!!!!!
				total: totalArticles.length,
				perPage: pagination.perPage,
				currentPage: pagination.page,
				totalPages: Math.ceil(totalArticles.length / pagination.perPage),
			};
	
			const articles = await this.articleModel.findAll({
				attributes: {
					exclude: attributesToExcludeFromArticle,
				},
				where: whereConditionsForArticle,
				include: [
					{
						model: Category,
						as: "category",
						attributes: {
							exclude: ["publishStatus"],
						},
					},
					{
						model: Media,
						as: "media",
						attributes: {
							exclude: attributesToExcludeFromMedia,
						},
						where: whereConditionsForMedia,
					},
                    {
                        model: Tag,
                        as: "tags", // Matches the alias in @BelongsToMany
                        through: { attributes: [] }, // Exclude the pivot table fields if not needed
                    },
                    {
						model: User,
						as: "creator",
						attributes: ["id", "firstName", "lastName"],
					},
				],
				order: [[sorting.sortBy, sorting.sortDirection]],
				limit: pagination.perPage,
				offset: (pagination.page - 1) * pagination.perPage, 
			});

			
			
			// console.log('getAllArticles totalArticles :', totalArticles)
			// console.log('getAllArticles whereConditionsForArticle :', whereConditionsForArticle)
			// console.log('getAllArticles paginationResult :', paginationResult)
			// console.log('getAllArticles articles.length :', articles.length)
			// console.log('getAllArticles articles :', articles)


			if(articles.length){
				paginationResult.count = articles.length;
			}
			
	
			if (articles.length === 0) {
				throw new NotFoundException(
					"No articles found matching the given criteria.",
				);
			}
	
			return { pagination: paginationResult, articles: articles };
		} catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND ||
                error.status === HttpStatus.FORBIDDEN
            ) {
                throw error;
            }

			throw new InternalServerErrorException(
				"Internal server error. An unexpected error occurred while fetching the articles.",
			);
		}
	}

	async getArticlesByCategoryId(
		categoryId: number,
		sortBy: "views" | "createdAt" = "createdAt",
		sortDirection: "asc" | "desc" = "desc",
		requestor: Requestor,
        pagination: Pagination
	): Promise<{ pagination: any; articles: Article[] }>{
		const attributesToExcludeFromMedia =
			requestor === Requestor.CMS
				? ["isPhysicallyExist", "publishStatus", "articleId"]
				: [];

		const whereConditionsForMedia =
			requestor === Requestor.CMS
				? { isPhysicallyExist: isExsistFormat.YES }
				: {};

        const totalArticles = await this.articleModel.findAll({
			attributes: {
				exclude: [
					"requestor",
					"validationStatus",
					"categoryId",
					"publishStatus",
					"creatorId",
				],
			},
			where: {
				categoryId,
				validationStatus: "approved",
				publishStatus: "published",
			},
			order: [[sortBy, sortDirection]],
			include: [
				{
					model: Category,
					as: "category",
					attributes: {
						exclude: ["publishStatus"],
					},
				},
				{
					model: Media,
					as: "media",
					attributes: {
						exclude: attributesToExcludeFromMedia,
					},
					where: whereConditionsForMedia,
				},
                {
                    model: Tag,
                    as: "tags", // Matches the alias in @BelongsToMany
                    through: { attributes: [] }, // Exclude the pivot table fields if not needed
                },
			],
		});


        const paginationResult = {
            count: pagination.perPage, //fix it!!!!!!
            total: totalArticles.length,
            perPage: pagination.perPage,
            currentPage: pagination.page,
            totalPages: Math.ceil(totalArticles.length / pagination.perPage),
        };

        let articles = await  this.articleModel.findAll({
			attributes: {
				exclude: [
					"requestor",
					"validationStatus",
					"categoryId",
					"publishStatus",
					"creatorId",
				],
			},
            limit: pagination.perPage,
            offset: (pagination.page - 1) * pagination.perPage, 
			where: {
				categoryId,
				validationStatus: "approved",
				publishStatus: "published",
			},
			order: [[sortBy, sortDirection]],
			include: [
				{
					model: Category,
					as: "category",
					attributes: {
						exclude: ["publishStatus"],
					},
				},
				{
					model: Media,
					as: "media",
					attributes: {
						exclude: attributesToExcludeFromMedia,
					},
					where: whereConditionsForMedia,
				},
                {
                    model: Tag,
                    as: "tags", // Matches the alias in @BelongsToMany
                    through: { attributes: [] }, // Exclude the pivot table fields if not needed
                },
			],
		});


        if(articles.length){
            paginationResult.count = articles.length;
        }
        

        if (articles.length === 0) {
            throw new NotFoundException(
                "No articles found matching the given criteria.",
            );
        }

        return { pagination: paginationResult, articles: articles };
	}

    async getArticlesByTagId(
		tagId: number,
		sortBy: "views" | "createdAt" = "createdAt",
		sortDirection: "asc" | "desc" = "desc",
		requestor: Requestor,
        pagination: Pagination
	): Promise<{ pagination: any; articles: Article[] }> {
		const attributesToExcludeFromMedia =
			requestor === Requestor.CMS
				? ["isPhysicallyExist", "publishStatus", "articleId"]
				: [];

		const whereConditionsForMedia =
			requestor === Requestor.CMS
				? { isPhysicallyExist: isExsistFormat.YES }
				: {};

        const totalArticles =await this.articleModel.findAll({
			attributes: {
				exclude: [
					"requestor",
					"validationStatus",
					"categoryId",
					"publishStatus",
					"creatorId",
				],
			},
			where: {
				validationStatus: "approved",
				publishStatus: "published",
			},
			order: [[sortBy, sortDirection]],
			include: [
				{
					model: Category,
					as: "category",
					attributes: {
						exclude: ["publishStatus"],
					},
				},
				{
					model: Media,
					as: "media",
					attributes: {
						exclude: attributesToExcludeFromMedia,
					},
					where: whereConditionsForMedia,
				},
                {
                    model: Tag,
                    as: "tags",
                    through: { attributes: [] },
                    where: {
                        id: tagId,
                    },
                    required: true,
                },
			],
		});

        const paginationResult = {
            count: pagination.perPage, //fix it!!!!!!
            total: totalArticles.length,
            perPage: pagination.perPage,
            currentPage: pagination.page,
            totalPages: Math.ceil(totalArticles.length / pagination.perPage),
        };

		let articles = await this.articleModel.findAll({
			attributes: {
				exclude: [
					"requestor",
					"validationStatus",
					"categoryId",
					"publishStatus",
					"creatorId",
				],
			},
			where: {
				validationStatus: "approved",
				publishStatus: "published",
			},
			order: [[sortBy, sortDirection]],
            limit: pagination.perPage,
            offset: (pagination.page - 1) * pagination.perPage, 
			include: [
				{
					model: Category,
					as: "category",
					attributes: {
						exclude: ["publishStatus"],
					},
				},
				{
					model: Media,
					as: "media",
					attributes: {
						exclude: attributesToExcludeFromMedia,
					},
					where: whereConditionsForMedia,
				},
                {
                    model: Tag,
                    as: "tags",
                    through: { attributes: [] },
                    where: {
                        id: tagId,
                    },
                    required: true,
                },
			],
		});
        if(articles.length){
            paginationResult.count = articles.length;
        }
        

        if (articles.length === 0) {
            throw new NotFoundException(
                "No articles found matching the given criteria.",
            );
        }

        return { pagination: paginationResult, articles: articles };
	}

    async trigetToUpdateTalentByIdOpenSearch(id: number) {
        let article_data_full = await this.getArticleById(id,Requestor.ADMIN);

        let article_to_save = await this.adminOpensearchService.updateArticle(article_data_full);

        return article_to_save;
    }

	async getPublisherArticles(
		publisherEmail: string, 
		sorting: SoringArticles, 
		pagination: Pagination
	): Promise<{ pagination: any, articles: Article[] }> {
		try {
			// Find the publisher by email
			const user = await this.adminUserService.findByEmail({
				email: publisherEmail,
			});

			if (!user) {
				throw new NotFoundException(
					`User with email ${publisherEmail} not found`,
				);
			}


			const totalArticles = await this.articleModel.count({
				where: {
					creatorId: user.id,
				},
			});
	
			const articles = await this.articleModel.findAll({
				where: {
					creatorId: user.id,
				},
				attributes: {
					exclude: [
						"validationStatus",
						"requestor",
						"creatorId",
						"categoryId",
					],
				},
				include: [
					{
						model: Category,
						as: "category",
					},
					{
						model: Media,
						as: "media",
						attributes: {
							exclude: [
								"isPhysicallyExist",
								"publishStatus",
								"articleId",
							],
						},
						where: { isPhysicallyExist: isExsistFormat.YES },
					},
                    {
                        model: Tag,
                        as: "tags", // Matches the alias in @BelongsToMany
                        through: { attributes: [] }, // Exclude the pivot table fields if not needed
                    },
				],
				order: [[sorting.sortBy, sorting.sortDirection.toUpperCase()]], 
				limit: pagination.perPage, 
				offset: (pagination.page - 1) * pagination.perPage, 
			});
	
			const paginationResult = {
				count: articles.length, 
				total: totalArticles, 
				perPage: pagination.perPage, 
				currentPage: pagination.page, 
				totalPages: Math.ceil(totalArticles / pagination.perPage),
			};

			return { 
				pagination: paginationResult, 
				articles 
			};
			
		} catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND
            ) {
                throw error;
            }
			throw new InternalServerErrorException("Failed to fetch articles");
		}
	}

	async updateArticle(
		id: number,
		updateArticleDto: UpdateArticleDto,
	): Promise<Article> {
        try {
            const articleOwnershipValidation = await this.getArticleById(
                id,
                updateArticleDto.requestor,
                updateArticleDto.creatorEmail,
            );
    
            const article = await this.articleModel.findByPk(id, {
                include: [Media],
            });
    
            if (!article) {
                throw new NotFoundException(`Article with ID ${id} not found.`);
            }
    
            if (updateArticleDto.media && updateArticleDto.media.length > 0) {
                const mediaItems = await Promise.all(
                    updateArticleDto.media.map(async (mediaId) => {
                        const mediaItem = await this.adminMediaService.findOne(
                            mediaId,
                        );
                        if (!mediaItem) {
                            throw new NotFoundException(
                                `Media with ID ${mediaId} not found`,
                            );
                        }
                        return mediaItem;
                    }),
                );
                await article.$set("media", mediaItems);
            } else if (updateArticleDto.media === null) {
                await article.$set("media", []);
            }
    
            if (updateArticleDto.tags && updateArticleDto.tags.length > 0) {
                const tagItems = await Promise.all(
                    updateArticleDto.tags.map(async (tagId) => {
                        const tagItem = await this.adminTagService.findOne(
                            tagId,
                        );
                        if (!tagItem) {
                            throw new NotFoundException(
                                `Tag with ID ${tagId} not found`,
                            );
                        }
                        return tagItem;
                    }),
                );
                await article.$set("tags", tagItems);
            } else if (updateArticleDto.tags === null) {
                await article.$set("tags", []);
            }
    
            const { media, tags, ...updateData } = updateArticleDto;
    
            await article.update(updateData);
            await article.reload();
    
            const articleSanitized = await this.articleModel.findByPk(article.id, {
                attributes: {
                    exclude: ["requestor", "validationStatus", "creatorId"],
                },
            });
            if(process.env.NODE_ENV !=='test'){
                await this.trigetToUpdateTalentByIdOpenSearch(article.id);
            }
            return articleSanitized;
        } catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND ||
                error.status === HttpStatus.FORBIDDEN
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                `An error occurred while updating article. ${error}`, 
            );
        }
		
	}

	async deleteArticle(
		id: number,
		requestor: Requestor,
		creatorEmail: string,
	): Promise<void> {
        try {
            if (!Requestor.ADMIN) {
                const articleOwnershipValidation = await this.getArticleById(
                    id,
                    requestor,
                    creatorEmail,
                );
            }
    
            const article = await this.articleModel.findByPk(id);
            if(!article) {
                throw new NotFoundException(`Article with ID ${id} not found`);
            }
    
            await article.destroy();
            if(process.env.NODE_ENV !=='test'){
                await this.adminOpensearchService.removeArticle(id);
            }
        } catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND ||
                error.status === HttpStatus.FORBIDDEN
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                `An error occurred while deleting article. ${error}`, 
            );
        }

	}
	async articleOwnerValidation(
		article: Article,
		requesor: Requestor,
		creatorEmail: string,
	) {
		const user = await this.adminUserService.findByEmail({
			email: creatorEmail,
		});

		if (requesor === Requestor.PUBLISHER && article.creatorId !== user.id) {
			throw new ForbiddenException(
				`You do not have rights to do manipulations with article ${article.id}`,
			);
		}
	}

	async pushArticleToOpenSearch() {

		let sorting: SoringArticles = {
			sortBy: SortByArticles.VIEWS,
			sortDirection: SortDirection.ASC
		}
		
		let pagination: Pagination = {
			page: Number(1),
			perPage: Number(1000)
		}

        let articles = await this.getAllArticles(Requestor.ADMIN, sorting, undefined,undefined,undefined,undefined,pagination)

		for (const article of await articles.articles) {
			const is_alredy_saved_article = await this.adminOpensearchService.findOneArticle(article.id);
			if (!is_alredy_saved_article) {
				// If the product does not exist, create it in the OpenSearch index
				this.adminOpensearchService.createArticle(article);
			}else{
                await this.adminOpensearchService.updateArticle(article);
            }
		}
        return "Data successfully pushed into the opensearch";
    }
}
