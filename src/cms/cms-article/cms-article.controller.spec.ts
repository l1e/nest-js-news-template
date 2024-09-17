import { Test, TestingModule } from "@nestjs/testing";
import { CmsArticleController } from "./cms-article.controller";
import { CmsCategoryModule } from "../cms-category/cms-category.module";
import { DatabaseModule } from "./../../../src/database/database.module";
import { CmsArticleModule } from "./cms-article.module";
import { S3Module } from "nestjs-s3";
import { AdminCategoryModule } from "./../../../src/admin/admin-category/admin-category.module";
import { CmsArticleService } from "./cms-article.service";
import { AdminArticleService } from "./../../../src/admin/admin-article/admin-article.service";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { AdminMediaService } from "./../../../src/admin/admin-media/admin-media.service";
require("dotenv").config();
describe("CmsArticleController", () => {
	let controller: CmsArticleController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CmsArticleController],
			imports: [
				DatabaseModule,
				CmsArticleModule,
				AdminCategoryModule,
				S3Module.forRoot({
					config: {
						credentials: {
							accessKeyId: process.env.AWS_S3_ACCESS_KEY,
							secretAccessKey:
								process.env.AWS_S3_SECRET_ACCESS_KEY,
						},
						endpoint: process.env.AWS_S3_ENDPOINT,
						forcePathStyle: true,
						region: process.env.AWS_S3_REGION,
						// signatureVersion: 'v4',
					},
				}),
			],
			providers: [
				CmsArticleService,
				AdminArticleService,
				AdminUserService,
				AdminMediaService,
			],
		}).compile();

		controller = module.get<CmsArticleController>(CmsArticleController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
