import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { S3Module } from "nestjs-s3";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";
import { CmsArticleController } from "./cms-article.controller";
import { DatabaseModule } from "./../../../src/database/database.module";
import { CmsArticleModule } from "./cms-article.module";
import { AdminCategoryModule } from "./../../../src/admin/admin-category/admin-category.module";
import { CmsArticleService } from "./cms-article.service";
import { AdminArticleService } from "./../../../src/admin/admin-article/admin-article.service";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { AdminMediaService } from "./../../../src/admin/admin-media/admin-media.service";
import { AdminOpensearchService } from "./../../../src/admin/admin-opensearch/admin-opensearch.service";


describe("CmsArticleController", () => {
	let controller: CmsArticleController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CmsArticleController],
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					envFilePath: process.env.NODE_ENV === 'development' ? '.env' : `.env.${process.env.NODE_ENV}`,
				}),
				DatabaseModule,
				CmsArticleModule,
				AdminCategoryModule,
				S3Module.forRoot({
					config: {
						credentials: {
							accessKeyId: process.env.AWS_S3_ACCESS_KEY,
							secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
						},
						endpoint: process.env.AWS_S3_ENDPOINT,
						forcePathStyle: true,
						region: process.env.AWS_S3_REGION,
					},
				}),
				CacheModule.registerAsync<RedisClientOptions>({
					imports: [ConfigModule], 
					useFactory: async (configService: ConfigService) => ({
						isGlobal: true,
						store: redisStore,
						url: `${configService.get<string>('REDIS_SERVER_NODE_URL')}:${configService.get<number>('REDIS_PORT')}`,
						ttl: 600,
					}),
					inject: [ConfigService],
				}),
			],
			providers: [
				CmsArticleService,
				AdminArticleService,
				AdminUserService,
				AdminMediaService,
				AdminOpensearchService,
				ConfigService,
			],
		}).compile();

		controller = module.get<CmsArticleController>(CmsArticleController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
