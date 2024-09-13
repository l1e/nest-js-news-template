import { Test, TestingModule } from "@nestjs/testing";
import { CmsPublisherController } from "./cms-publisher.controller";

describe("CmsPublisherController", () => {
	let controller: CmsPublisherController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CmsPublisherController],
		}).compile();

		controller = module.get<CmsPublisherController>(CmsPublisherController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
