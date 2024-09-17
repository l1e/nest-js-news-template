import { Test, TestingModule } from "@nestjs/testing";
import { CmsPublisherController } from "./cms-publisher.controller";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { DatabaseModule } from "./../../../src/database/database.module";
import { CmsPublisherModule } from "./cms-publisher.module";
import { CmsPublisherService } from "./cms-publisher.service";
require("dotenv").config();
describe("CmsPublisherController", () => {
	let controller: CmsPublisherController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DatabaseModule, CmsPublisherModule],
		}).compile();

		controller = module.get<CmsPublisherController>(CmsPublisherController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
