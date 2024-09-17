import { Test, TestingModule } from "@nestjs/testing";
import { CmsCategoryController } from "./cms-category.controller";
import { CmsCategoryModule } from "./cms-category.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Category } from "./../../../src/admin/admin-category/model/category.model";
import { Article } from "./../../../src/admin/admin-article/model/article.model";
import { User } from "./../../../src/admin/admin-user/model/user.model";
import { Media } from "./../../../src/admin/admin-media/model/media.model";
import { DatabaseModule } from "./../../../src/database/database.module";
require("dotenv").config();
describe("CmsCategoryController", () => {
	let controller: CmsCategoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DatabaseModule, CmsCategoryModule],
		}).compile();

		controller = module.get<CmsCategoryController>(CmsCategoryController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
