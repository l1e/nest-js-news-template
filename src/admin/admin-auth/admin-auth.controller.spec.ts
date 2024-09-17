import { Test, TestingModule } from "@nestjs/testing";
import { AdminAuthController } from "./admin-auth.controller";
import { DatabaseModule } from "./../../../src/database/database.module";
import { AdminAuthService } from "./admin-auth.service";
import { AdminUserService } from "../admin-user/admin-user.service";

describe("AdminAuthController", () => {
	let controller: AdminAuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminAuthController],
			imports: [DatabaseModule],
			providers: [AdminAuthService, AdminUserService],
		}).compile();

		controller = module.get<AdminAuthController>(AdminAuthController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
