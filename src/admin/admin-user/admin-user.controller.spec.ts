import { Test, TestingModule } from "@nestjs/testing";
import { AdminUserController } from "./admin-user.controller";
import { DatabaseModule } from "./../../../src/database/database.module";
import { AdminUserService } from "./admin-user.service";

describe("UserController", () => {
	let controller: AdminUserController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminUserController],
			imports: [DatabaseModule],
			providers: [AdminUserService],
		}).compile();

		controller = module.get<AdminUserController>(AdminUserController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
