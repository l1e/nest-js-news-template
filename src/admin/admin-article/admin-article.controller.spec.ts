import { Test, TestingModule } from "@nestjs/testing";
import { AdminArticleController } from "./admin-article.controller";

describe("AdminArticleController", () => {
	let controller: AdminArticleController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminArticleController],
		}).compile();

		controller = module.get<AdminArticleController>(AdminArticleController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
