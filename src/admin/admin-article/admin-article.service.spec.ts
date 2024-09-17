import {
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

describe("AdminArticleService", () => {
	let service: AdminArticleService;
	let adminCategoryService: AdminCategoryService;
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
	};

	const mockAdminCategoryService = {
		getCategoryById: jest.fn(),
	};

	const mockAdminUserService = {
		findByEmail: jest.fn(),
	};

	const mockAdminMediaService = {
		findOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			// imports: [
			// 	SequelizeModule.forRoot({
			// 		dialect: "mysql",
			// 		host: process.env.MYSQL_HOST,
			// 		port: Number(process.env.MYSQL_PORT),
			// 		username: process.env.MYSQL_USERNAME,
			// 		password: process.env.MYSQL_PASSWORD,
			// 		database: process.env.MYSQL_DATABASE,
			// 		models: [User, Article, Category, Media],
			// 		autoLoadModels: true,
			// 		synchronize: true,
			// 		sync: { alter: true },
			// 	}),
			// 	SequelizeModule.forFeature([Article, Category, User, Media]),
			// ],
			providers: [
				AdminArticleService,
				{
					provide: AdminCategoryService,
					useValue: mockAdminCategoryService,
				},
				{ provide: AdminUserService, useValue: mockAdminUserService },
				{ provide: AdminMediaService, useValue: mockAdminMediaService },
				{ provide: getModelToken(Article), useValue: mockArticleModel },
			],
		}).compile();

		service = module.get<AdminArticleService>(AdminArticleService);
		adminCategoryService =
			module.get<AdminCategoryService>(AdminCategoryService);
		adminUserService = module.get<AdminUserService>(AdminUserService);
		adminMediaService = module.get<AdminMediaService>(AdminMediaService);
		articleModel = module.get<typeof Article>(getModelToken(Article));
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	// Add tests for each method

	describe("createArticle", () => {
		// it("should create an article", async () => {
		// 	const createArticleDto = {
		// 		title: "Test Article",
		// 		description: "Test Description",
		// 		categoryId: 1,
		// 		creatorEmail: "test@example.com",
		// 		media: [],
		// 	};
		// 	const mockCategory = { id: 1 };
		// 	const mockUser = { id: 1 };
		// 	const mockArticle = { id: 1, ...mockCreateArticleDtoNew };
		// 	jest.spyOn(
		// 		adminCategoryService,
		// 		"getCategoryById",
		// 	).mockResolvedValue(categoryMockDataCreated);
		// 	jest.spyOn(adminUserService, "findByEmail").mockResolvedValue(
		// 		mockUser,
		// 	);
		// 	jest.spyOn(mockArticleModel, "create").mockResolvedValue(
		// 		mockArticle,
		// 	);
		// 	jest.spyOn(mockArticleModel, "findByPk").mockResolvedValue(
		// 		mockArticle,
		// 	);
		// 	const result = await service.createArticle(mockCreateArticleDtoNew);
		// 	expect(result).toEqual(mockArticle);
		// });
		// it("should throw NotFoundException if category not found", async () => {
		// 	const createArticleDto = {
		// 		title: "Test Article",
		// 		description: "Test Description",
		// 		categoryId: 999,
		// 	};
		// 	jest.spyOn(
		// 		adminCategoryService,
		// 		"getCategoryById",
		// 	).mockResolvedValue(null);
		// 	await expect(
		// 		service.createArticle(mockCreateArticleDtoNew),
		// 	).rejects.toThrow(NotFoundException);
		// });
		// Add more tests for various scenarios
	});

	describe("Create an article", () => {
		it("should create an article", async () => {
			const createArticleDto: CreateArticleDto = mockCreateArticleDtoNew;
			const createdArticle = {
				...categoryMockDataCreated,
				$set: jest.fn(),
			};
			const mockCategory = {
				id: createArticleDto.categoryId,
				name: "Tech",
			};
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
			(articleModel.create as jest.Mock).mockResolvedValue(
				createdArticle,
			);
			(createdArticle.$set as jest.Mock).mockResolvedValue(undefined);

			(articleModel.findByPk as jest.Mock).mockResolvedValue({
				...createdArticle,
				media: mockMedia,
			});

			const result = await service.createArticle(createArticleDto);

			console.log("Create an article result:", result);

			expect(result).toEqual({
				...createdArticle,
				media: mockMedia,
			});

			// Ensure the correct external service calls were made
			expect(adminCategoryService.getCategoryById).toHaveBeenCalledWith(
				createArticleDto.categoryId,
				Requestor.ADMIN,
			);
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

			// Ensure the final sanitized article was fetched
			expect(articleModel.findByPk).toHaveBeenCalledWith(
				createdArticle.id,
				{
					attributes: {
						exclude: ["requestor", "validationStatus", "creatorId"],
					},
					include: [Category, { model: Media, as: "media" }],
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

			// Act
			const result = await service.updateArticle(1, mockUpdateArticleDto);

			// Assertions
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

		// Add more tests for various scenarios
	});

	describe("getAllArticles", () => {
		it("should return all articles", async () => {
			const articles = [mockCreateArticleDtoCreated];
			(articleModel.findAll as jest.Mock).mockResolvedValue(articles);

			const result = await service.getAllArticles(Requestor.ADMIN);

			expect(result).toEqual(articles);
			expect(result[0].id).toEqual(1);

			expect(articleModel.findAll).toHaveBeenCalled();
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

	// Add similar tests for other methods like updateArticle, deleteArticle, etc.
});
