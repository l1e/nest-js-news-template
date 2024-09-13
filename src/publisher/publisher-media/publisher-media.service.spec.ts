import { Test, TestingModule } from "@nestjs/testing";
import { PublisherMediaService } from "./publisher-media.service";

describe("PublisherMediaService", () => {
	let service: PublisherMediaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PublisherMediaService],
		}).compile();

		service = module.get<PublisherMediaService>(PublisherMediaService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
