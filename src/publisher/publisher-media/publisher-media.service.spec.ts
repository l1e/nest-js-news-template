import { Test, TestingModule } from "@nestjs/testing";
import { S3Module } from "nestjs-s3";
import { PublisherMediaService } from "./publisher-media.service";
import { AdminMediaService } from "./../../../src/admin/admin-media/admin-media.service";
import { DatabaseModule } from "./../../../src/database/database.module";

describe("PublisherMediaService", () => {
	let service: PublisherMediaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PublisherMediaService, AdminMediaService],
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

		service = module.get<PublisherMediaService>(PublisherMediaService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
