import { Test, TestingModule } from "@nestjs/testing";
import { PublisherAuthService } from "./publisher-auth.service";
import { DatabaseModule } from "./../../../src/database/database.module";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { AdminAuthService } from "./../../../src/admin/admin-auth/admin-auth.service";

describe("PublisherAuthService", () => {
	let service: PublisherAuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PublisherAuthService,
				AdminUserService,
				AdminAuthService,
			],
			imports: [DatabaseModule],
		}).compile();

		service = module.get<PublisherAuthService>(PublisherAuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
