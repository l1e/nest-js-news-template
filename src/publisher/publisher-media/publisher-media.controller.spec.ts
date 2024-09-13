import { Test, TestingModule } from "@nestjs/testing";
import { PublisherMediaController } from "./publisher-media.controller";

describe("PublisherMediaController", () => {
	let controller: PublisherMediaController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PublisherMediaController],
		}).compile();

		controller = module.get<PublisherMediaController>(
			PublisherMediaController,
		);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
