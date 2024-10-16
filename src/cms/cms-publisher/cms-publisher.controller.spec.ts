import { Test, TestingModule } from "@nestjs/testing";
import { RedisClientOptions } from "redis";
import { ConfigService, ConfigModule } from "@nestjs/config";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";
import { CmsPublisherController } from "./cms-publisher.controller";
import { DatabaseModule } from "./../../../src/database/database.module";
import { CmsPublisherModule } from "./cms-publisher.module";


describe("CmsPublisherController", () => {
	let controller: CmsPublisherController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				DatabaseModule, 
				CmsPublisherModule,
				ConfigModule.forRoot({
					isGlobal: true,
					envFilePath: process.env.NODE_ENV === 'development' ? '.env' : `.env.${process.env.NODE_ENV}`,
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

		controller = module.get<CmsPublisherController>(CmsPublisherController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
