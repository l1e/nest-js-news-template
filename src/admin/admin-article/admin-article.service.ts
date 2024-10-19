import { updatedArticle } from './../../../test/test.mock.data';
import { AdminOpensearchService } from './../admin-opensearch/admin-opensearch.service';
import {
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
import { SortBy, SortDirection } from './../../utils/types/types';

@Injectable()
export class AdminArticleService {
	constructor(
		@InjectModel(Article)
		private readonly articleModel: typeof Article,
		private adminCategoryService: AdminCategoryService,
		private adminUserService: AdminUserService,
		private adminMediaService: AdminMediaService,
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

		const articleSanitized = await this.articleModel.findByPk(article.id, {
			attributes: {
				exclude: ["requestor", "validationStatus", "creatorId"],
			},
			include: [Category, { model: Media, as: "media" }],
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
					? ["requestor", "validationStatus", "categoryId"]
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
						model: Media,
						as: "media",
						attributes: {
							exclude: attributesToExcludeFromMedia,
						},
					},
				],
			});

			console.log('getArticleById article:',article)

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

				console.log('getArticleById additionalFilter', additionalFilter)

			delete additionalFilter?.creatorId;
			if (requestor === Requestor.CMS) {
				delete additionalFilter?.creator;
				delete additionalFilter?.category?.publishStatus;
			}

			console.log('getArticleById additionalFilter delete', additionalFilter)

			return additionalFilter;
		} catch (error) {
			if (error instanceof NotFoundException) {
				console.log("0: Error fetching article", error);
				throw error;
			}

			// console.log("1: Error fetching article", error);

			throw new InternalServerErrorException("Failed to fetch articles");
		}
	}

	async getArticleOfTheDay(requestor: Requestor): Promise<Article> {
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
	}

	async getArticleSpecial(requestor: Requestor): Promise<Article[]> {
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
			],
		});

		return article;
	}

	async getAllArticles(
		requestor: Requestor,
		sortBy: SortBy,
		sortDirection: SortDirection,
		categoryId: number,
		publisherId: number,
		textToSearch: string,
		minArticleVeiws: number,
	): Promise<Article[]> {

		let whereConditionsGeneral = [];
		if (categoryId) whereConditionsGeneral.push({ categoryId });
		if (publisherId) whereConditionsGeneral.push({ creatorId : publisherId });
		if (minArticleVeiws) whereConditionsGeneral.push({ views: { [Op.gte]: minArticleVeiws } });
		
		if (textToSearch) {
			whereConditionsGeneral.push({
				[Op.or]: [
					{ title: { [Op.like]: `%${textToSearch}%` } },
					{ description: { [Op.like]: `%${textToSearch}%` } }
				]
			});
		}
		

		const attributesToExcludeFromArticle =
			requestor === Requestor.CMS
				? [
						// "creatorId",
						// "requestor",
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
						  [Op.and]: whereConditionsGeneral
					  }
					: {
						  [Op.and]: whereConditionsGeneral
					  };

		const whereConditionsForMedia =
			requestor === Requestor.CMS
				? { isPhysicallyExist: isExsistFormat.YES }
				: {};

				// console.log('whereConditionsForArticle:', whereConditionsForArticle)
		try {
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
				],
				order: [[sortBy, sortDirection]],
			});

			if (articles.length === 0) {
				throw new NotFoundException(
					"No articles found matching the given criteria.",
				);
			}

			return articles;
		} catch (error) {
			if (error instanceof NotFoundException) {
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
	): Promise<Article[]> {
		const attributesToExcludeFromMedia =
			requestor === Requestor.CMS
				? ["isPhysicallyExist", "publishStatus", "articleId"]
				: [];

		const whereConditionsForMedia =
			requestor === Requestor.CMS
				? { isPhysicallyExist: isExsistFormat.YES }
				: {};

		return this.articleModel.findAll({
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
			],
		});
	}

    async trigetToUpdateTalentByIdOpenSearch(id: number) {
        let article_data_full = await this.getArticleById(id,Requestor.ADMIN);

        let article_to_save = await this.adminOpensearchService.updateArticle(article_data_full);

        return article_to_save;
    }

	async getPublisherArticles(publisherEmail: string): Promise<Article[]> {
		try {
			const user = await this.adminUserService.findByEmail({
				email: publisherEmail,
			});

			if (!user) {
				throw new NotFoundException(
					`User with email ${publisherEmail} not found`,
				);
			}

			return this.articleModel.findAll({
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
				],
			});
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new InternalServerErrorException("Failed to fetch articles");
		}
	}

	async updateArticle(
		id: number,
		updateArticleDto: UpdateArticleDto,
	): Promise<Article> {
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

		const { media, ...updateData } = updateArticleDto;

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
	}

	async deleteArticle(
		id: number,
		requestor: Requestor,
		creatorEmail: string,
	): Promise<void> {
		if (!Requestor.ADMIN) {
			const articleOwnershipValidation = await this.getArticleById(
				id,
				requestor,
				creatorEmail,
			);
		}

		const article = await this.articleModel.findByPk(id);

		await article.destroy();
		if(process.env.NODE_ENV !=='test'){
			await this.adminOpensearchService.removeArticle(id);
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
			throw new NotFoundException(
				`You do not have rights to do manipulations with article ${article.id}`,
			);
		}
	}

	async pushArticleToOpenSearch() {
        let articles = await this.getAllArticles(Requestor.ADMIN, SortBy.VIEWS, SortDirection.ASC, undefined,undefined,undefined,undefined)

		for (const article of await articles) {
			const is_alredy_saved_article = await this.adminOpensearchService.findOneArticle(article.id);
			if (!is_alredy_saved_article) {
				// If the product does not exist, create it in the OpenSearch index
				this.adminOpensearchService.createArticle(article);
			}
		}
        return "Data successfully pushed into the opensearch";
    }
}
