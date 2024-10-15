import { Module } from "@nestjs/common";
import { CmsArticleService } from "./cms-article.service";
import { CmsArticleController } from "./cms-article.controller";
import { AdminArticleModule } from "./../../admin/admin-article/admin-article.module";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
	imports: [
		AdminArticleModule,
		CacheModule.register<RedisClientOptions>({
			isGlobal: true,
			store: redisStore,
			url: process.env.REDIS_SERVER_NODE_URL+':'+process.env.REDIS_PORT,
			ttl: 600,
		}),

	],
	providers: [CmsArticleService],
	controllers: [CmsArticleController],
})
export class CmsArticleModule {}
