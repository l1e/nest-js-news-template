import { Test, TestingModule } from "@nestjs/testing";
import { PublisherAuthController } from "./publisher-auth.controller";

describe("PublisherAuthController", () => {
	let controller: PublisherAuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PublisherAuthController],
		}).compile();

		controller = module.get<PublisherAuthController>(
			PublisherAuthController,
		);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
