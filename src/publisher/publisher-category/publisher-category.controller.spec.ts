import { Test, TestingModule } from "@nestjs/testing";
import { PublisherCategoryController } from "./publisher-category.controller";

describe("PublisherCategoryController", () => {
	let controller: PublisherCategoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PublisherCategoryController],
		}).compile();

		controller = module.get<PublisherCategoryController>(
			PublisherCategoryController,
		);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
