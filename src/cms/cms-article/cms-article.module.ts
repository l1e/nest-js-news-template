import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";
import { CmsArticleService } from "./cms-article.service";
import { CmsArticleController } from "./cms-article.controller";
import { AdminArticleModule } from "./../../admin/admin-article/admin-article.module";
import { AdminOpensearchModule } from "./../../admin/admin-opensearch/admin-opensearch.module";
import { AdminTagModule } from "./../../admin/admin-tag/admin-tag.module";

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
		AdminOpensearchModule,
        AdminTagModule

	],
	providers: [CmsArticleService],
	controllers: [CmsArticleController],
})
export class CmsArticleModule {}
