import { Test, TestingModule } from "@nestjs/testing";
import { PublisherMeService } from "./publisher-me.service";

describe("PublisherMeService", () => {
	let service: PublisherMeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PublisherMeService],
		}).compile();

		service = module.get<PublisherMeService>(PublisherMeService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
