import { Test, TestingModule } from "@nestjs/testing";
import { AdminMediaService } from "./admin-media.service";
import { DatabaseModule } from "./../../../src/database/database.module";
import { S3Module } from "nestjs-s3";

describe("AdminMediaService", () => {
	let service: AdminMediaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AdminMediaService],
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

		service = module.get<AdminMediaService>(AdminMediaService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
