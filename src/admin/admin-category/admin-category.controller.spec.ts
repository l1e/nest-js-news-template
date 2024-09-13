import { Test, TestingModule } from "@nestjs/testing";
import { AdminCategoryController } from "./admin-category.controller";

describe("AdminCategoryController", () => {
	let controller: AdminCategoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminCategoryController],
		}).compile();

		controller = module.get<AdminCategoryController>(
			AdminCategoryController,
		);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
