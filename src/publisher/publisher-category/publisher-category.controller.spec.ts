import { Test, TestingModule } from "@nestjs/testing";
import { PublisherCategoryController } from "./publisher-category.controller";
import { S3Module } from "nestjs-s3";
import { PublisherCategoryService } from "./publisher-category.service";
import { DatabaseModule } from "./../../../src/database/database.module";
import { PublisherCategoryModule } from "./publisher-category.module";
import { AdminCategoryModule } from "./../../../src/admin/admin-category/admin-category.module";
import { AdminArticleService } from "./../../../src/admin/admin-article/admin-article.service";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { AdminMediaService } from "./../../../src/admin/admin-media/admin-media.service";
import { AdminOpensearchService } from "./../../admin/admin-opensearch/admin-opensearch.service";

describe("PublisherCategoryController", () => {
	let controller: PublisherCategoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PublisherCategoryController],
			imports: [
				DatabaseModule,
				PublisherCategoryModule,
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
				PublisherCategoryService,
				AdminArticleService,
				AdminOpensearchService,
				AdminUserService,
				AdminMediaService,
			],
		}).compile();

		controller = module.get<PublisherCategoryController>(
			PublisherCategoryController,
		);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
