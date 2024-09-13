import { Test, TestingModule } from "@nestjs/testing";
import { CmsArticleController } from "./cms-article.controller";

describe("CmsArticleController", () => {
	let controller: CmsArticleController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CmsArticleController],
		}).compile();

		controller = module.get<CmsArticleController>(CmsArticleController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
