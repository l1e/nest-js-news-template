import { Module } from '@nestjs/common';
import { PublisherTagController } from './publisher-tag.controller';
import { PublisherTagService } from './publisher-tag.service';
import { AdminTagModule } from './../../admin/admin-tag/admin-tag.module';

@Module({
  imports: [AdminTagModule],
  controllers: [PublisherTagController],
  providers: [PublisherTagService],
  exports: [PublisherTagService]  
})
export class PublisherTagModule {}
