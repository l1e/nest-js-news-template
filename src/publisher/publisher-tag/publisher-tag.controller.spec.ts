import { Test, TestingModule } from '@nestjs/testing';
import { S3Module } from 'nestjs-s3';
import { PublisherTagController } from './publisher-tag.controller';
import { DatabaseModule } from "./../../../src/database/database.module";
import { PublisherTagModule } from './publisher-tag.module';
import { AdminTagModule } from './../../../src/admin/admin-tag/admin-tag.module';


describe('PublisherTagController', () => {
  let controller: PublisherTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [PublisherTagController],
        imports: [
            DatabaseModule,
            PublisherTagModule,
            AdminTagModule,
            S3Module.forRoot({
                config: {
                    credentials: {
                        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                        secretAccessKey:
                            process.env.AWS_S3_SECRET_ACCESS_KEY,
                    },
                    endpoint: process.env.AWS_S3_ENDPOINT,
                    forcePathStyle: true,
                    region: process.env.AWS_S3_REGION,
                    // signatureVersion: 'v4',
                },
            }),
        ],
    }).compile();

    controller = module.get<PublisherTagController>(PublisherTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
