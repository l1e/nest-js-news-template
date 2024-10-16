import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {

	console.log('Current Environment:', process.env.NODE_ENV);

	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				AppModule,
				ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : `.env.${process.env.NODE_ENV}`,
                }),
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect({ success: true, status_code: 200, data: "Hello World!" });
	});
});
