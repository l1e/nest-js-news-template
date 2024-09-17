import { Test, TestingModule } from "@nestjs/testing";
import { CmsCategoryService } from "./cms-category.service";
import { AdminCategoryModule } from "./../../../src/admin/admin-category/admin-category.module";
import { AdminCategoryService } from "./../../../src/admin/admin-category/admin-category.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Article } from "./../../../src/admin/admin-article/model/article.model";
import { Category } from "./../../../src/admin/admin-category/model/category.model";
import { Media } from "./../../../src/admin/admin-media/model/media.model";
import { User } from "./../../../src/admin/admin-user/model/user.model";
import { DatabaseModule } from "./../../../src/database/database.module";

describe("CmsCategoryService", () => {
	let service: CmsCategoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CmsCategoryService, AdminCategoryService],
			imports: [DatabaseModule],
		}).compile();

		service = module.get<CmsCategoryService>(CmsCategoryService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
