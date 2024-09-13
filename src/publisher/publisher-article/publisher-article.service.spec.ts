import { Test, TestingModule } from "@nestjs/testing";
import { PublisherArticleService } from "./publisher-article.service";

describe("PublisherArticleService", () => {
	let service: PublisherArticleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PublisherArticleService],
		}).compile();

		service = module.get<PublisherArticleService>(PublisherArticleService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
