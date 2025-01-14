import {
	articlesAll,
	categoryMockDataCreated,
	mockCreateArticleDtoCreated,
	mockCreateArticleDtoNew,
	mockMediaItems,
	mockUpdateArticleDto,
	mockUser,
	updatedArticle,
} from "../../../test/test.mock.data";
import { Test, TestingModule } from "@nestjs/testing";
import { AdminArticleService } from "./admin-article.service";
import { AdminCategoryService } from "../admin-category/admin-category.service";
import { AdminUserService } from "../admin-user/admin-user.service";
import { AdminMediaService } from "../admin-media/admin-media.service";
import { Article } from "./model/article.model";
import { getModelToken } from "@nestjs/sequelize";
import { Category } from "../admin-category/model/category.model";
import { Media } from "../admin-media/model/media.model";
import {
	PublishStatus,
	Requestor,
	ValidationStatus,
	ArticleOfTheDay,
	ArticleSpecial,
} from "./model/article.model";
import {
	NotFoundException,
	InternalServerErrorException,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { CreateArticleDto } from "./dto/article.create.dto";
import { AdminOpensearchService } from "../admin-opensearch/admin-opensearch.service";
import { Pagination, SoringArticles, SortByArticles, SortDirection } from "./../../../src/utils/types/types";
import { AdminTagService } from "../admin-tag/admin-tag.service";
import { Tag } from "../admin-tag/model/tag.model";

describe("AdminArticleService", () => {
	let service: AdminArticleService;
	let adminCategoryService: AdminCategoryService;
    let adminTagService: AdminTagService;
	let adminUserService: AdminUserService;
	let adminMediaService: AdminMediaService;

	let articleModel: typeof Article;

	const mockArticleModel = {
		create: jest.fn(),
		findByPk: jest.fn(),
		findOne: jest.fn(),
		findAll: jest.fn(),
		destroy: jest.fn(),
		update: jest.fn(),
		reload: jest.fn(),
		count: jest.fn(), 
	};

	const mockAdminCategoryService = {
		getCategoryById: jest.fn(),
	};

    // const mockAdminTagService = {
	// 	getTagById: jest.fn(),
	// };

	const mockAdminUserService = {
		findByEmail: jest.fn(),
	};

	const mockAdminMediaService = {
		findOne: jest.fn(),
	};

    const mockAdminTagService = {
		findOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdminArticleService,
				AdminOpensearchService,
				{
					provide: AdminCategoryService,
					useValue: mockAdminCategoryService,
				},
				{
					provide: AdminTagService,
					useValue: mockAdminTagService,
				},
				{ provide: AdminUserService, useValue: mockAdminUserService },
				{ provide: AdminMediaService, useValue: mockAdminMediaService },
				{ provide: getModelToken(Article), useValue: mockArticleModel },
			],
		}).compile();

		service = module.get<AdminArticleService>(AdminArticleService);
		adminCategoryService =
			module.get<AdminCategoryService>(AdminCategoryService);
		adminTagService =
			module.get<AdminTagService>(AdminTagService);
		adminUserService = module.get<AdminUserService>(AdminUserService);
		adminMediaService = module.get<AdminMediaService>(AdminMediaService);
		articleModel = module.get<typeof Article>(getModelToken(Article));
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("Create an article", () => {

		it("should create an article", async () => {
			const createArticleDto: CreateArticleDto = mockCreateArticleDtoNew;
			const createdArticle = {
				...mockCreateArticleDtoCreated,
				$set: jest.fn(),
			};
			const mockCategory = {
				id: createArticleDto.categoryId,
				name: "Tech",
			};
			const mockTags = [{ id: 1 }, { id: 2 }];
			const mockMedia = [{ id: 1 }, { id: 2 }];

			(
				adminCategoryService.getCategoryById as jest.Mock
			).mockResolvedValue(mockCategory);

			(adminUserService.findByEmail as jest.Mock).mockResolvedValue(
				mockUser,
			);

			(adminMediaService.findOne as jest.Mock).mockResolvedValueOnce(
				mockMedia[0],
			);
			(adminMediaService.findOne as jest.Mock).mockResolvedValueOnce(
				mockMedia[1],
			);

			(adminTagService.findOne as jest.Mock).mockResolvedValueOnce(
				mockTags[0],
			);
			(adminTagService.findOne as jest.Mock).mockResolvedValueOnce(
				mockTags[1],
			);

			(articleModel.create as jest.Mock).mockResolvedValue(
				createdArticle,
			);
			(createdArticle.$set as jest.Mock).mockResolvedValue(undefined);

			(articleModel.findByPk as jest.Mock).mockResolvedValue({
				...createdArticle,
				media: mockMedia,
                tag: mockTags,
			});

			const result = await service.createArticle(createArticleDto);

			// console.log("Create an article result:", result);

			expect(result).toEqual({
				...createdArticle,
				media: mockMedia,
                tag: mockTags,
			});

			// Ensure the correct external service calls were made
			expect(adminCategoryService.getCategoryById).toHaveBeenCalledWith(
				createArticleDto.categoryId,
				Requestor.ADMIN,
			);

			// expect(adminTagService.getTagById).toHaveBeenCalledWith(
			// 	createArticleDto.tags,
			// 	Requestor.ADMIN,
			// );

			expect(adminUserService.findByEmail).toHaveBeenCalledWith({
				email: createArticleDto.creatorEmail,
			});
			expect(adminMediaService.findOne).toHaveBeenCalledTimes(2); // Two media items

			expect(articleModel.create).toHaveBeenCalledWith({
				title: createArticleDto.title,
				description: createArticleDto.description,
				publishStatus: PublishStatus.DRAFT, // Assuming default value
				validationStatus: ValidationStatus.PENDING, // Assuming default value
				articleOfTheDay: ArticleOfTheDay.NO, // Assuming default value
				articleSpecial: ArticleSpecial.NO, // Assuming default value
				views: 0, // Assuming default value
				categoryId: createArticleDto.categoryId,
				creatorId: mockUser.id,
			});

			expect(createdArticle.$set).toHaveBeenCalledWith(
				"media",
				mockMedia,
			);

			expect(createdArticle.$set).toHaveBeenCalledWith(
				"tags",
				mockTags,
			);

			// Ensure the final sanitized article was fetched
			expect(articleModel.findByPk).toHaveBeenCalledWith(
				createdArticle.id,
				{
					attributes: {
						exclude: ["requestor", "validationStatus", "creatorId"],
					},
					include: [Category, { model: Media, as: "media" },{ model: Tag, as: "tags" }],
				},
			);
		});
	});

	describe("updateArticle", () => {

		it("should successfully update an article", async () => {
			const mockArticle: Partial<Article> = {
				...updatedArticle,
				update: jest.fn(),
				$set: jest.fn(),
				reload: jest.fn(),
			};

			jest.spyOn(service, "getArticleById").mockResolvedValue(
				mockArticle as Article,
			);
			// Setup mocks
			(adminMediaService.findOne as jest.Mock).mockImplementation((id) =>
				Promise.resolve(
					mockMediaItems.find((media) => media.id === id),
				),
			);
			(articleModel.findByPk as jest.Mock).mockResolvedValue(
				updatedArticle,
			);
			(updatedArticle.$set as jest.Mock).mockResolvedValue(undefined);
			(updatedArticle.update as jest.Mock).mockResolvedValue(
				updatedArticle,
			);
			(updatedArticle.reload as jest.Mock).mockResolvedValue(
				updatedArticle,
			);

			const result = await service.updateArticle(1, mockUpdateArticleDto);

			expect(result).toEqual(updatedArticle);

			expect(articleModel.findByPk).toHaveBeenCalledWith(1, {
				include: [Media],
			});
			expect(updatedArticle.$set).toHaveBeenCalledWith(
				"media",
				mockMediaItems,
			);
			expect(updatedArticle.update).toHaveBeenCalledWith({
				title: "Updated Title",
				description: "Updated description",
				publishStatus: "published",
				validationStatus: "approved",
				articleOfTheDay: "yes",
				articleSpecial: "yes",
				views: 10,
				requestor: "admin",
				creatorEmail: "test.creator@dev.com",
				categoryId: 2,
			});
			expect(updatedArticle.reload).toHaveBeenCalled();
		});
	});

	describe("getArticleById", () => {

		it("should return an article by ID", async () => {
			const article = mockCreateArticleDtoCreated;
			console.log("getArticleById article:", article);
			(articleModel.findOne as jest.Mock).mockResolvedValue(article);

			const result = await service.getArticleById(1, Requestor.ADMIN);

			console.log("getArticleById result:", result);

			expect(result).toEqual(article);
			expect(articleModel.findOne).toHaveBeenCalledWith({
				where: { id: 1 }, // Or whatever condition is being applied
				attributes: { exclude: [] },
				include: expect.anything(),
			});
		});

		it("should throw an error if category is not found", async () => {
			(articleModel.findOne as jest.Mock).mockResolvedValue(null);

			await expect(
				service.getArticleById(2, Requestor.ADMIN),
			).rejects.toThrow(
				new HttpException(
					`Article with ID 2 not found`,
					HttpStatus.NOT_FOUND,
				),
			);
		});

	});

	describe("getAllArticles", () => {

		it("should return all articles", async () => {
			const articles = [mockCreateArticleDtoCreated]; 
			const totalArticlesCount = articles.length;

			let sorting: SoringArticles = {
				sortBy: SortByArticles.VIEWS,
				sortDirection: SortDirection.ASC
			};
			
			let pagination: Pagination = {
				page: Number(1),
				perPage: Number(1000)
			};

			(articleModel.findAll as jest.Mock).mockResolvedValue(articles);
			(articleModel.count as jest.Mock).mockResolvedValue(totalArticlesCount); // Mock the count method
	
			const result = await service.getAllArticles(
				Requestor.ADMIN,
				sorting,
				undefined,
				undefined,
				undefined,
				undefined,
				pagination
			);
	
			expect(result.articles).toEqual(articles);
			expect(result.articles[0].id).toEqual(1);
			expect(result.pagination.total).toEqual(totalArticlesCount);
	
			expect(articleModel.findAll).toHaveBeenCalled();
			// expect(articleModel.count).toHaveBeenCalled();
		});

	});

	describe("deletearticle", () => {

		it("should delete an article", async () => {
			const article = {
				...mockCreateArticleDtoCreated,
				destroy: jest.fn(),
			};
			(articleModel.findByPk as jest.Mock).mockResolvedValue(article);

			await service.deleteArticle(1, Requestor.ADMIN, undefined);

			expect(article.destroy).toHaveBeenCalled();
		});
		
	});

});
