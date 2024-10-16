import { Test, TestingModule } from "@nestjs/testing";
import { CmsCategoryController } from "./cms-category.controller";
import { CmsCategoryModule } from "./cms-category.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Category } from "./../../../src/admin/admin-category/model/category.model";
import { Article } from "./../../../src/admin/admin-article/model/article.model";
import { User } from "./../../../src/admin/admin-user/model/user.model";
import { Media } from "./../../../src/admin/admin-media/model/media.model";
import { DatabaseModule } from "./../../../src/database/database.module";
import { CmsCategoryService } from "./cms-category.service";
import { AdminCategoryService } from "./../../../src/admin/admin-category/admin-category.service";
import { AdminCategoryModule } from "./../../../src/admin/admin-category/admin-category.module";
import { RedisClientOptions } from "redis";
import { ConfigService, ConfigModule } from "@nestjs/config";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";

describe("CmsCategoryController", () => {
	let controller: CmsCategoryController;

	beforeEach(async () => {		
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CmsCategoryController],
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					envFilePath: process.env.NODE_ENV === 'development' ? '.env' : `.env.${process.env.NODE_ENV}`,
				}),
				DatabaseModule, 
				CmsCategoryModule,
				AdminCategoryModule,
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
				CmsCategoryService,
				AdminCategoryService
			]
		}).compile();

		controller = module.get<CmsCategoryController>(CmsCategoryController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
