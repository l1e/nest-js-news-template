import { Test, TestingModule } from "@nestjs/testing";
import { CmsCategoryService } from "./cms-category.service";
import { AdminCategoryService } from "./../../../src/admin/admin-category/admin-category.service";
import { DatabaseModule } from "./../../../src/database/database.module";

describe("CmsCategoryService", () => {
	let service: CmsCategoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CmsCategoryService, AdminCategoryService],
			imports: [DatabaseModule],
		}).compile();

		service = module.get<CmsCategoryService>(CmsCategoryService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
