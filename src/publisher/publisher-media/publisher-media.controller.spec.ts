import { Test, TestingModule } from "@nestjs/testing";
import { PublisherMediaController } from "./publisher-media.controller";
import { DatabaseModule } from "./../../../src/database/database.module";
import { PublisherMediaModule } from "./publisher-media.module";
import { S3Module } from "nestjs-s3";
import { AdminMediaService } from "./../../../src/admin/admin-media/admin-media.service";
import { PublisherMediaService } from "./publisher-media.service";
require("dotenv").config();
describe("PublisherMediaController", () => {
	let controller: PublisherMediaController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PublisherMediaController],
			imports: [
				DatabaseModule,
				PublisherMediaModule,
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
				// CmsArticleService,
				// AdminArticleService,
				// AdminUserService,
				PublisherMediaService,
				AdminMediaService,
			],
		}).compile();

		controller = module.get<PublisherMediaController>(
			PublisherMediaController,
		);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
