import { Module } from "@nestjs/common";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { CmsPublisherService } from "./cms-publisher.service";
import { CmsPublisherController } from "./cms-publisher.controller";
import { UserModule } from "./../../admin/admin-user/admin-user.module";

@Module({
	imports: [
		UserModule,
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
	providers: [CmsPublisherService],
	controllers: [CmsPublisherController],
})
export class CmsPublisherModule {}
