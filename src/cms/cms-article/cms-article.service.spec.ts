import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3Module } from "nestjs-s3";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";
import { CmsArticleService } from "./cms-article.service";
import { DatabaseModule } from "./../../../src/database/database.module";
import { AdminArticleService } from "./../../../src/admin/admin-article/admin-article.service";
import { AdminMediaService } from "./../../../src/admin/admin-media/admin-media.service";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { AdminCategoryService } from "./../../../src/admin/admin-category/admin-category.service";
import { AdminOpensearchService } from "./../../../src/admin/admin-opensearch/admin-opensearch.service";
import { AdminTagService } from "./../../../src/admin/admin-tag/admin-tag.service";



describe("CmsArticleService", () => {
	let service: CmsArticleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CmsArticleService,
				AdminCategoryService,
				AdminArticleService,
				AdminOpensearchService,
				AdminUserService,
				AdminMediaService,
				ConfigService,
                AdminTagService
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
		}).compile();

		service = module.get<CmsArticleService>(CmsArticleService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
