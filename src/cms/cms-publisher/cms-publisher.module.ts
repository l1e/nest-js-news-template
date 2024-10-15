import { Module } from "@nestjs/common";
import { CmsPublisherService } from "./cms-publisher.service";
import { CmsPublisherController } from "./cms-publisher.controller";
import { UserModule } from "./../../admin/admin-user/admin-user.module";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule } from "@nestjs/cache-manager";
@Module({
	imports: [
		UserModule,
		CacheModule.register<RedisClientOptions>({
			isGlobal: true,
			store: redisStore,
			url: process.env.REDIS_SERVER_NODE_URL+':'+process.env.REDIS_PORT,
			ttl: 600,
		}),
	],
	providers: [CmsPublisherService],
	controllers: [CmsPublisherController],
})
export class CmsPublisherModule {}
