import { Test, TestingModule } from "@nestjs/testing";
import { PublisherMeController } from "./publisher-me.controller";

describe("PublisherMeController", () => {
	let controller: PublisherMeController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PublisherMeController],
		}).compile();

		controller = module.get<PublisherMeController>(PublisherMeController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
