import { Module } from "@nestjs/common";
import { CmsCategoryService } from "./cms-category.service";
import { CmsCategoryController } from "./cms-category.controller";
import { AdminCategoryModule } from "./../../admin/admin-category/admin-category.module";

import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
	imports: [
		AdminCategoryModule,
		CacheModule.register<RedisClientOptions>({
			isGlobal: true,
			store: redisStore,
			url: process.env.REDIS_SERVER_NODE_URL+':'+process.env.REDIS_PORT,
			ttl: 600,
		}),
	],
	providers: [CmsCategoryService],
	controllers: [CmsCategoryController],
})
export class CmsCategoryModule {}
