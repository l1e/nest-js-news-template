import { Test, TestingModule } from "@nestjs/testing";
import { S3Module } from "nestjs-s3";
import { PublisherArticleController } from "./publisher-article.controller";
import { DatabaseModule } from "./../../../src/database/database.module";
import { PublisherArticleModule } from "./publisher-article.module";
import { AdminCategoryModule } from "./../../../src/admin/admin-category/admin-category.module";
import { PublisherArticleService } from "./publisher-article.service";
import { AdminArticleService } from "./../../../src/admin/admin-article/admin-article.service";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { AdminMediaService } from "./../../../src/admin/admin-media/admin-media.service";
import { AdminOpensearchService } from "./../../../src/admin/admin-opensearch/admin-opensearch.service";
import { AdminTagModule } from "./../../../src/admin/admin-tag/admin-tag.module";

describe("PublisherArticleController", () => {
	let controller: PublisherArticleController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PublisherArticleController],
			imports: [
				DatabaseModule,
				PublisherArticleModule,
				AdminCategoryModule,
                AdminTagModule,
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
				PublisherArticleService,
				AdminArticleService,
				AdminOpensearchService,
				AdminUserService,
				AdminMediaService,
			],
		}).compile();

		controller = module.get<PublisherArticleController>(
			PublisherArticleController,
		);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
