import { Test, TestingModule } from "@nestjs/testing";
import { AdminCategoryService } from "./admin-category.service";

describe("AdminCategoryService", () => {
	let service: AdminCategoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AdminCategoryService],
		}).compile();

		service = module.get<AdminCategoryService>(AdminCategoryService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
