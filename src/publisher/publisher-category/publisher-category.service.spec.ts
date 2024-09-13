import { Test, TestingModule } from "@nestjs/testing";
import { PublisherCategoryService } from "./publisher-category.service";

describe("PublisherCategoryService", () => {
	let service: PublisherCategoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PublisherCategoryService],
		}).compile();

		service = module.get<PublisherCategoryService>(
			PublisherCategoryService,
		);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
