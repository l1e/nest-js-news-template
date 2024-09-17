import { Test, TestingModule } from "@nestjs/testing";
import { AdminAuthService } from "./admin-auth.service";
import { DatabaseModule } from "./../../../src/database/database.module";
import { AdminUserService } from "../admin-user/admin-user.service";

describe("AdminAuthService", () => {
	let service: AdminAuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AdminAuthService, AdminUserService],
			imports: [DatabaseModule],
		}).compile();

		service = module.get<AdminAuthService>(AdminAuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
