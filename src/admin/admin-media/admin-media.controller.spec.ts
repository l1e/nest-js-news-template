import { Test, TestingModule } from "@nestjs/testing";
import { S3Module } from "nestjs-s3";
import { AdminMediaController } from "./admin-media.controller";
import { DatabaseModule } from "./../../../src/database/database.module";
import { AdminMediaService } from "./admin-media.service";

describe("AdminMediaController", () => {
	let controller: AdminMediaController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminMediaController],
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
			providers: [AdminMediaService],
		}).compile();

		controller = module.get<AdminMediaController>(AdminMediaController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
