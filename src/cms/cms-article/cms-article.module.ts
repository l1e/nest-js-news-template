import { Module } from "@nestjs/common";
import { CmsArticleService } from "./cms-article.service";
import { CmsArticleController } from "./cms-article.controller";
import { AdminArticleModule } from "./../../admin/admin-article/admin-article.module";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";

@Module({
	imports: [
		AdminArticleModule,
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
	providers: [CmsArticleService],
	controllers: [CmsArticleController],
})
export class CmsArticleModule {}
