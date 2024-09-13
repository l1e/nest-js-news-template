import { Test, TestingModule } from "@nestjs/testing";
import { CmsPublisherService } from "./cms-publisher.service";

describe("CmsPublisherService", () => {
	let service: CmsPublisherService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CmsPublisherService],
		}).compile();

		service = module.get<CmsPublisherService>(CmsPublisherService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
