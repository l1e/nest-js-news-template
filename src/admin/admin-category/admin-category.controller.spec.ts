import { Test, TestingModule } from "@nestjs/testing";
import { AdminCategoryController } from "./admin-category.controller";
import { AdminCategoryService } from "./admin-category.service";
import { CreateCategoryDto } from "./dto/category.create.dto";
import { Category } from "./model/category.model";
import {
	categoryMockDataCreated,
	categoryMockDataNew,
} from "../../../test/test.mock.data";

describe("AdminCategoryController", () => {
	let controller: AdminCategoryController;
	let service: AdminCategoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminCategoryController],
			providers: [
				{
					provide: AdminCategoryService,
					useValue: {
						createCategory: jest.fn(),
						getCategoryById: jest.fn(),
						getAllCategories: jest.fn(),
						updateCategory: jest.fn(),
						deleteCategory: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<AdminCategoryController>(
			AdminCategoryController,
		);
		service = module.get<AdminCategoryService>(AdminCategoryService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("createCategory", () => {
		it("should call AdminCategoryService.createCategory and return the result", async () => {
			const createCategoryDto: CreateCategoryDto = categoryMockDataNew;
			const category: Category = categoryMockDataCreated as Category;

			jest.spyOn(service, "createCategory").mockResolvedValue(category);

			const result = await controller.createCategory(createCategoryDto);

			expect(result).toEqual(category);
			expect(service.createCategory).toHaveBeenCalledWith(
				createCategoryDto,
			);
		});
	});

	describe("getCategoryById", () => {
		it("should call AdminCategoryService.getCategoryById and return the result", async () => {
			const category: Category = categoryMockDataCreated as Category;

			jest.spyOn(service, "getCategoryById").mockResolvedValue(category);

			const result = await controller.getCategoryById(1);

			expect(result).toEqual(category);
			expect(service.getCategoryById).toHaveBeenCalledWith(1);
		});
	});

	describe("getAllCategories", () => {
		it("should call AdminCategoryService.getAllCategories and return the result", async () => {
			const categories: Category[] = [
				categoryMockDataCreated,
			] as Category[];

			jest.spyOn(service, "getAllCategories").mockResolvedValue(
				categories,
			);

			const result = await controller.getAllCategories();
			console.log("getAllCategories result:", result);
			console.log(
				"getAllCategories service.getAllCategories:",
				await service.getAllCategories,
			);

			expect(result).toEqual(categories);
			expect(service.getAllCategories).toHaveBeenCalledWith("admin");
		});
	});

	describe("updateCategory", () => {
		it("should call AdminCategoryService.updateCategory and return the result", async () => {
			const updateCategoryDto: CreateCategoryDto = categoryMockDataNew;
			const updatedCategory: Category =
				categoryMockDataCreated as Category;

			jest.spyOn(service, "updateCategory").mockResolvedValue(
				updatedCategory,
			);

			const result = await controller.updateCategory(
				1,
				updateCategoryDto,
			);

			expect(result).toEqual(updatedCategory);
			expect(service.updateCategory).toHaveBeenCalledWith(
				1,
				updateCategoryDto,
			);
		});
	});

	describe("deleteCategory", () => {
		it("should call AdminCategoryService.deleteCategory", async () => {
			jest.spyOn(service, "deleteCategory").mockResolvedValue();

			await controller.deleteCategory(1);

			expect(service.deleteCategory).toHaveBeenCalledWith(1);
		});
	});
});
