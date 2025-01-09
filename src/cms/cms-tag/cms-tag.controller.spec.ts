import { Test, TestingModule } from '@nestjs/testing';
import { CmsTagController } from './cms-tag.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from "cache-manager-redis-store";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientOptions } from 'redis';
import { DatabaseModule } from './../../../src/database/database.module';
import { AdminTagModule } from './../../../src/admin/admin-tag/admin-tag.module';
import { CmsTagModule } from './cms-tag.module';

describe('CmsTagController', () => {
  let controller: CmsTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            DatabaseModule,
            CmsTagModule,
            AdminTagModule, 
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
      controllers: [CmsTagController],
    }).compile();

    controller = module.get<CmsTagController>(CmsTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
