import { Test, TestingModule } from "@nestjs/testing";
import { CmsPublisherService } from "./cms-publisher.service";
import { DatabaseModule } from "./../../../src/database/database.module";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";

describe("CmsPublisherService", () => {
	let service: CmsPublisherService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CmsPublisherService, AdminUserService],
			imports: [DatabaseModule],
		}).compile();

		service = module.get<CmsPublisherService>(CmsPublisherService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
