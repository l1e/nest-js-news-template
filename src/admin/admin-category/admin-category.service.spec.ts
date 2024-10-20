import { Test, TestingModule } from "@nestjs/testing";
import { HttpException, HttpStatus } from "@nestjs/common";
import { getModelToken } from "@nestjs/sequelize";

import { AdminCategoryService } from "./admin-category.service";
import { Category } from "./model/category.model";
import { CreateCategoryDto } from "./dto/category.create.dto";
import {
	categoryMockDataCreated,
	categoryMockDataNew,
} from "../../../test/test.mock.data";
import { Requestor } from "../admin-article/model/article.model";
import { SortByGeneral, SortDirection } from "./../../utils/types/types";

describe("AdminCategoryService", () => {
	let service: AdminCategoryService;
	let categoryModel: typeof Category;

	beforeEach(async () => {
		console.log('beforeEach ')
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdminCategoryService,
				{
					provide: getModelToken(Category),
					useValue: {
						create: jest.fn(),
						findByPk: jest.fn(),
						findAll: jest.fn(),
						destroy: jest.fn(),
						count: jest.fn(), 
					},
				},
			],
		}).compile();

		service = module.get<AdminCategoryService>(AdminCategoryService);
		categoryModel = module.get<typeof Category>(getModelToken(Category));
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("createCategory", () => {
		it("should create a category", async () => {
			const createCategoryDto: CreateCategoryDto = categoryMockDataNew;
			const category = categoryMockDataCreated;

			(categoryModel.create as jest.Mock).mockResolvedValue(category);

			const result = await service.createCategory(createCategoryDto);

			expect(result).toEqual(category);
			expect(categoryModel.create).toHaveBeenCalledWith(
				createCategoryDto,
			);
		});
	});

	describe("getCategoryById", () => {
		it("should return a category by ID", async () => {
			const category = categoryMockDataCreated;
			(categoryModel.findByPk as jest.Mock).mockResolvedValue(category);

			const result = await service.getCategoryById(1);

			expect(result).toEqual(category);
			expect(categoryModel.findByPk).toHaveBeenCalledWith(1, {
				include: expect.anything(),
			});
		});

		it("should throw an error if category is not found", async () => {
			(categoryModel.findByPk as jest.Mock).mockResolvedValue(null);

			await expect(service.getCategoryById(1)).rejects.toThrow(
				new HttpException(
					`Category with ID 1 not found`,
					HttpStatus.NOT_FOUND,
				),
			);
		});
	});

	describe("getAllCategories", () => {
		it("should return all categories", async () => {
			const categories = [categoryMockDataCreated];

			// Mock the return value for count and findAll
			(categoryModel.count as jest.Mock).mockResolvedValue(categories.length);
			(categoryModel.findAll as jest.Mock).mockResolvedValue(categories);

			const result = await service.getAllCategories(
				Requestor.ADMIN,
				{ sortBy: SortByGeneral.ID, sortDirection: SortDirection.ASC },
				{ page: 1, perPage: 2 }
			);

			expect(result).toEqual({
				pagination: {
					count: categories.length,
					total: categories.length,
					per_page: 2,
					current_page: 1,
					total_pages: 1,
				},
				categories,
			});
			expect(categoryModel.count).toHaveBeenCalled(); 
			expect(categoryModel.findAll).toHaveBeenCalled();
		});
	});

	describe("updateCategory", () => {
		it("should update a category", async () => {
			const category = { ...categoryMockDataCreated, update: jest.fn() };

			(categoryModel.findByPk as jest.Mock).mockResolvedValue(category);
			const updateDto = {
				name: "Updated Name",
				description: "Updated Desc",
			};

			await service.updateCategory(1, updateDto);

			expect(category.update).toHaveBeenCalledWith(updateDto);
		});

		it("should throw if category not found", async () => {
			(categoryModel.findByPk as jest.Mock).mockResolvedValue(null);

			await expect(
				service.updateCategory(999, { name: "New Name" }),
			).rejects.toThrow("Category with ID 999 not found");
		});
	});

	describe("deleteCategory", () => {
		it("should delete a category", async () => {
			const category = { ...categoryMockDataCreated, destroy: jest.fn() };
			(categoryModel.findByPk as jest.Mock).mockResolvedValue(category);

			await service.deleteCategory(1);

			expect(category.destroy).toHaveBeenCalled();
		});
	});
});
