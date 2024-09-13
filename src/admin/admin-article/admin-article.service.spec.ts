import { Test, TestingModule } from "@nestjs/testing";
import { AdminArticleService } from "./admin-article.service";

describe("AdminArticleService", () => {
	let service: AdminArticleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AdminArticleService],
		}).compile();

		service = module.get<AdminArticleService>(AdminArticleService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
