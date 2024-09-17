import { Test, TestingModule } from "@nestjs/testing";
import { PublisherAuthController } from "./publisher-auth.controller";
import { DatabaseModule } from "./../../../src/database/database.module";
import { PublisherAuthService } from "./publisher-auth.service";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { AdminAuthService } from "./../../../src/admin/admin-auth/admin-auth.service";

describe("PublisherAuthController", () => {
	let controller: PublisherAuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PublisherAuthController],
			imports: [DatabaseModule],
			providers: [
				PublisherAuthService,
				AdminAuthService,
				AdminUserService,
			],
		}).compile();

		controller = module.get<PublisherAuthController>(
			PublisherAuthController,
		);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
