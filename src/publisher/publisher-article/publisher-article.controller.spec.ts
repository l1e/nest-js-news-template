import { Test, TestingModule } from "@nestjs/testing";
import { PublisherArticleController } from "./publisher-article.controller";

describe("PublisherArticleController", () => {
	let controller: PublisherArticleController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PublisherArticleController],
		}).compile();

		controller = module.get<PublisherArticleController>(
			PublisherArticleController,
		);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
