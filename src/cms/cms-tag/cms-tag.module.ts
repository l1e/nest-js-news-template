import { Module } from '@nestjs/common';
import { CmsTagService } from './cms-tag.service';
import { CmsTagController } from './cms-tag.controller';
import { AdminTagModule } from './../../admin/admin-tag/admin-tag.module';

@Module({
  imports: [AdminTagModule],
  providers: [CmsTagService],
  controllers: [CmsTagController],
  exports: [CmsTagService]
})
export class CmsTagModule {}
