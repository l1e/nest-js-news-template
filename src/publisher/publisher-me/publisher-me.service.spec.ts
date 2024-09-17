import { Test, TestingModule } from "@nestjs/testing";
import { PublisherMeService } from "./publisher-me.service";
import { DatabaseModule } from "./../../../src/database/database.module";

describe("PublisherMeService", () => {
	let service: PublisherMeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PublisherMeService],
			imports: [DatabaseModule],
		}).compile();

		service = module.get<PublisherMeService>(PublisherMeService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
