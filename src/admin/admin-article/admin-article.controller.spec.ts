import { Test, TestingModule } from "@nestjs/testing";
import { AdminArticleController } from "./admin-article.controller";
import { AdminArticleService } from "./admin-article.service";
import { AdminCategoryService } from "../admin-category/admin-category.service";
import { AdminUserService } from "../admin-user/admin-user.service";
import { AdminMediaService } from "../admin-media/admin-media.service";
import { CreateArticleDto } from "./dto/article.create.dto";

import {
	articlesAll,
	mockCreateArticleDtoCreated,
	mockUser,
} from "../../../test/test.mock.data";
import { UpdateArticleDto } from "./dto/update.article.dto";
import {
	Article,
	ArticleOfTheDay,
	ArticleSpecial,
	PublishStatus,
	Requestor,
	ValidationStatus,
} from "./model/article.model";
import { SortByArticles, SortDirection } from "./../../utils/types/types";
import { AdminOpensearchService } from "../admin-opensearch/admin-opensearch.service";
import { AdminTagService } from "../admin-tag/admin-tag.service";

describe("AdminArticleController", () => {
	let controller: AdminArticleController;
	let service: AdminArticleService;
	let adminCategoryService: AdminCategoryService;
    let adminTagService: AdminTagService;
	let adminUserService: AdminUserService;
	let adminMediaService: AdminMediaService;

	const mockArticleService = {
		createArticle: jest.fn(),
		updateArticle: jest.fn(),
		getArticleById: jest.fn(),
		getAllArticles: jest.fn(),
		deleteArticle: jest.fn(),
	};

	const mockAdminOpensearchService = {
		checkOpenSearchClusterHealth: jest.fn(),
		createArticle: jest.fn(),
		updateArticle: jest.fn(),
		removeArticle: jest.fn(),
		findOneArticle: jest.fn(),
		findArticlesByFilter: jest.fn(),
		formatArticlesByFilter: jest.fn(),
	};

	const mockAdminCategoryService = {
		getCategoryById: jest.fn(),
	};

    const mockAdminTagService = {
		getTagById: jest.fn(),
	};

	const mockAdminUserService = {
		findByEmail: jest.fn(),
	};

	const mockAdminMediaService = {
		findOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminArticleController],
			providers: [
				{ provide: AdminArticleService, useValue: mockArticleService },
				{ provide: AdminOpensearchService, useValue: mockAdminOpensearchService },
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
			],
		}).compile();

		controller = module.get<AdminArticleController>(AdminArticleController);
		service = module.get<AdminArticleService>(AdminArticleService);
		adminCategoryService =
			module.get<AdminCategoryService>(AdminCategoryService);
		adminTagService =
			module.get<AdminTagService>(AdminTagService);
		adminUserService = module.get<AdminUserService>(AdminUserService);
		adminMediaService = module.get<AdminMediaService>(AdminMediaService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("createArticle", () => {

		it("should create an article", async () => {
			const createArticleDto: CreateArticleDto = {
                title: "New Article",
                description: "Description of the article",
                categoryId: 1,
                creatorEmail: "creator@example.com",
                media: [],
                articleOfTheDay: ArticleOfTheDay.YES,
                creatorId: mockUser.id,
                tags: []
            };
			const createdArticle = { id: 1, ...createArticleDto };
			mockArticleService.createArticle.mockResolvedValue(createdArticle);

			const result = await controller.createArticle(
				createArticleDto,
				mockUser.email,
			);

			expect(result).toEqual(createdArticle);
			expect(mockArticleService.createArticle).toHaveBeenCalledWith(
				createArticleDto,
			);
		});
	});

	describe("updateArticle", () => {
		it("should update an article", async () => {
			const updateArticleDto: UpdateArticleDto = {
				title: "Updated Title",
				description: "Updated Description",
				publishStatus: PublishStatus.DRAFT, // Assuming default value
				validationStatus: ValidationStatus.PENDING, // Assuming default value
				articleOfTheDay: ArticleOfTheDay.NO, // Assuming default value
				articleSpecial: ArticleSpecial.NO, // Assuming default value
				views: 10,
				requestor: Requestor.ADMIN,
				creatorEmail: "test.creator@dev.com",
				categoryId: 2,
				media: [1, 2],
			};
			const updatedArticle = { id: 1, ...updateArticleDto };
			mockArticleService.updateArticle.mockResolvedValue(updatedArticle);
			const result = await controller.updateArticle(
				1,
				updateArticleDto,
				mockUser.email,
			);

			expect(result).toEqual(updatedArticle);
			expect(mockArticleService.updateArticle).toHaveBeenCalledWith(
				1,
				updateArticleDto,
			);
		});
	});

	describe("getArticleById", () => {
		it("should return an article by ID", async () => {
			const article: Article =
				mockCreateArticleDtoCreated as unknown as Article;

			mockArticleService.getArticleById.mockResolvedValue(article);
			const result = await controller.getArticleById(1, mockUser.email);

			expect(result).toEqual(article);
			expect(mockArticleService.getArticleById).toHaveBeenCalledWith(
				1,
				Requestor.ADMIN,
				"test.creator@dev.com",
			);
		});
	});

	describe("getAllArticles", () => {
		it("should return all articles", async () => {
			const articles = articlesAll;
			jest.spyOn(service, "getAllArticles").mockResolvedValue(
				articlesAll,
			);
			const result = await controller.getAllArticles(SortByArticles.VIEWS, SortDirection.ASC,undefined,undefined,undefined,undefined,undefined,undefined,1,100);
			expect(result).toEqual(articles);
			expect(service.getAllArticles).toHaveBeenCalled();
		});
	});

	describe("deleteArticle", () => {

		it("should delete an article", async () => {

			jest.spyOn(service, "deleteArticle").mockResolvedValue();
			await controller.deleteArticle(1, mockUser.email);
			expect(mockArticleService.deleteArticle).toHaveBeenCalledWith(
				1,
				Requestor.ADMIN,
				"test.creator@dev.com",
			);

		});

	});
});
