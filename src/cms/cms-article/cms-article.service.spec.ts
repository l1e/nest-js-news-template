import { Test, TestingModule } from "@nestjs/testing";
import { CmsArticleService } from "./cms-article.service";
import { DatabaseModule } from "./../../../src/database/database.module";
import { AdminArticleService } from "./../../../src/admin/admin-article/admin-article.service";
import { AdminMediaService } from "./../../../src/admin/admin-media/admin-media.service";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { AdminCategoryService } from "./../../../src/admin/admin-category/admin-category.service";
import { S3Module } from "nestjs-s3";
import { ConfigService } from "@nestjs/config";

describe("CmsArticleService", () => {
	let service: CmsArticleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CmsArticleService,
				AdminCategoryService,
				AdminArticleService,
				AdminUserService,
				AdminMediaService,
				ConfigService
			],
			imports: [
				DatabaseModule,
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
		}).compile();

		service = module.get<CmsArticleService>(CmsArticleService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
