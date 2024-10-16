import { Module } from "@nestjs/common";
import { CmsCategoryService } from "./cms-category.service";
import { CmsCategoryController } from "./cms-category.controller";
import { AdminCategoryModule } from "./../../admin/admin-category/admin-category.module";

import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
//need that for tests
require("dotenv").config();

@Module({
	imports: [
		AdminCategoryModule,
        CacheModule.registerAsync<RedisClientOptions>({
            useFactory: async (configService: ConfigService) => ({
                isGlobal: true,
                store: redisStore,
                url: `${configService.get<string>('REDIS_SERVER_NODE_URL')}:${configService.get<number>('REDIS_PORT')}`,
                ttl: 600,
            }),
            inject: [ConfigService],
        }),
	],
	providers: [CmsCategoryService],
	controllers: [CmsCategoryController],
})
export class CmsCategoryModule {}
