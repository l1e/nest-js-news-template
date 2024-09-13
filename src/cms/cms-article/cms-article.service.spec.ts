import { Test, TestingModule } from "@nestjs/testing";
import { CmsArticleService } from "./cms-article.service";

describe("CmsArticleService", () => {
	let service: CmsArticleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CmsArticleService],
		}).compile();

		service = module.get<CmsArticleService>(CmsArticleService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
