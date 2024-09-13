import {
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
import { UpdateArticleDto } from "./dto/update.article.dto";
import { isExsistFormat, Media } from "../admin-media/model/media.model";
import { AdminMediaService } from "../admin-media/admin-media.service";

@Injectable()
export class AdminArticleService {
	constructor(
		@InjectModel(Article)
		private readonly articleModel: typeof Article,
		private adminCategoryService: AdminCategoryService,
		private adminUserService: AdminUserService,
		private adminMediaService: AdminMediaService,
	) {}

	async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
		let category = await this.adminCategoryService.getCategoryById(
			createArticleDto.categoryId,
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

		const article = await this.articleModel.create({
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
		});

		if (media.length > 0) {
			await article.$set("media", media); // Assuming a Many-to-Many relationship with media
		}

		const articleSanitized = await this.articleModel.findByPk(article.id, {
			attributes: {
				exclude: ["requestor", "validationStatus", "creatorId"],
			},
			include: [Category, { model: Media, as: "media" }],
		});

		return articleSanitized;
	}

	async getArticleById(
		id: number,
		requestor: Requestor,
		creatorEmail?: string,
	): Promise<Article> {
		try {
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

			let additionalFilter = article.toJSON();
			delete additionalFilter?.creatorId;
			if (requestor === Requestor.CMS) {
				delete additionalFilter?.creator;
				delete additionalFilter?.category?.publishStatus;
			}

			return additionalFilter;
		} catch (error) {
			if (error instanceof NotFoundException) {
				console.error("0: Error fetching article", error);
				throw error;
			}

			throw new InternalServerErrorException("Failed to fetch articles");
		}
	}

	async getArticleOfTheDay(requestor: Requestor): Promise<Article> {
		const attributesToExcludeFromMedia =
			requestor === Requestor.CMS
				? ["isPhysicallyExist", "publishStatus", "articleId"]
				: [];

		const whereConditionsForMedia =
			requestor === Requestor.CMS
				? { isPhysicallyExist: isExsistFormat.YES }
				: {};

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
					where: whereConditionsForMedia,
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
		sortBy: "views" | "createdAt" = "createdAt",
		sortDirection: "asc" | "desc" = "desc",
	): Promise<Article[]> {
		const attributesToExcludeFromArticle =
			requestor === Requestor.CMS
				? [
						"creatorId",
						"requestor",
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
				? { validationStatus: "approved", publishStatus: "published" }
				: {};

		const whereConditionsForMedia =
			requestor === Requestor.CMS
				? { isPhysicallyExist: isExsistFormat.YES }
				: {};

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
			throw new NotFoundException(`Article with ID ${id} not found`);
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

		return articleSanitized;
	}

	async deleteArticle(
		id: number,
		requestor: Requestor,
		creatorEmail: string,
	): Promise<void> {
		const articleOwnershipValidation = await this.getArticleById(
			id,
			requestor,
			creatorEmail,
		);

		const article = await this.articleModel.findByPk(id);

		await article.destroy();
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
}
