import { Test, TestingModule } from "@nestjs/testing";
import { CmsCategoryService } from "./cms-category.service";

describe("CmsCategoryService", () => {
	let service: CmsCategoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CmsCategoryService],
		}).compile();

		service = module.get<CmsCategoryService>(CmsCategoryService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
