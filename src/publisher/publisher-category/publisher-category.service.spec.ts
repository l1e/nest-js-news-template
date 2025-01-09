import { Test, TestingModule } from "@nestjs/testing";
import { S3Module } from "nestjs-s3";
import { PublisherCategoryService } from "./publisher-category.service";
import { AdminCategoryService } from "./../../../src/admin/admin-category/admin-category.service";
import { AdminArticleService } from "./../../../src/admin/admin-article/admin-article.service";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { AdminMediaService } from "./../../../src/admin/admin-media/admin-media.service";
import { DatabaseModule } from "./../../../src/database/database.module";
import { AdminOpensearchService } from "./../../../src/admin/admin-opensearch/admin-opensearch.service";
import { AdminTagService } from "./../../../src/admin/admin-tag/admin-tag.service";

describe("PublisherCategoryService", () => {
	let service: PublisherCategoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PublisherCategoryService,
				AdminCategoryService,
                AdminTagService,
				AdminArticleService,
				AdminOpensearchService,
				AdminUserService,
				AdminMediaService,
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

		service = module.get<PublisherCategoryService>(
			PublisherCategoryService,
		);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
