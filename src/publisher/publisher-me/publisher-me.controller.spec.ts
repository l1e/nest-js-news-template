import { Test, TestingModule } from "@nestjs/testing";
import { PublisherMeController } from "./publisher-me.controller";
import { DatabaseModule } from "./../../../src/database/database.module";
import { PublisherMeModule } from "./publisher-me.module";

describe("PublisherMeController", () => {
	let controller: PublisherMeController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PublisherMeController],
			imports: [DatabaseModule, PublisherMeModule],
		}).compile();

		controller = module.get<PublisherMeController>(PublisherMeController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
