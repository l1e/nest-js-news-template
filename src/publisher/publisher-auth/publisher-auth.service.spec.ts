import { Test, TestingModule } from "@nestjs/testing";
import { PublisherAuthService } from "./publisher-auth.service";

describe("PublisherAuthService", () => {
	let service: PublisherAuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PublisherAuthService],
		}).compile();

		service = module.get<PublisherAuthService>(PublisherAuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
