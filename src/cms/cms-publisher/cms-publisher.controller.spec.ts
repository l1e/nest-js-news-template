import { Test, TestingModule } from "@nestjs/testing";
import { CmsPublisherController } from "./cms-publisher.controller";
import { AdminUserService } from "./../../../src/admin/admin-user/admin-user.service";
import { DatabaseModule } from "./../../../src/database/database.module";
import { CmsPublisherModule } from "./cms-publisher.module";
import { CmsPublisherService } from "./cms-publisher.service";
import { RedisClientOptions } from "redis";
import { ConfigService, ConfigModule } from "@nestjs/config";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";


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
					imports: [ConfigModule], // Import ConfigModule to use ConfigService
					useFactory: async (configService: ConfigService) => ({
						isGlobal: true,
						store: redisStore,
						url: `${configService.get<string>('REDIS_SERVER_NODE_URL')}:${configService.get<number>('REDIS_PORT')}`,
						ttl: 600,
					}),
					inject: [ConfigService], // Inject ConfigService for use in the factory
				}),
			],
		}).compile();

		controller = module.get<CmsPublisherController>(CmsPublisherController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
