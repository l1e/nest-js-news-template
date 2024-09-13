import { Test, TestingModule } from "@nestjs/testing";
import { CmsCategoryController } from "./cms-category.controller";

describe("CmsCategoryController", () => {
	let controller: CmsCategoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CmsCategoryController],
		}).compile();

		controller = module.get<CmsCategoryController>(CmsCategoryController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
