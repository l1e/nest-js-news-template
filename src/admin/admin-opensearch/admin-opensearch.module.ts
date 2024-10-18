import { Module } from '@nestjs/common';
import { AdminOpensearchService } from './admin-opensearch.service';
import { AdminOpensearchController } from './admin-opensearch.controller';

@Module({
  providers: [AdminOpensearchService],
  controllers: [AdminOpensearchController],
  exports: [AdminOpensearchService]
})
export class AdminOpensearchModule {}
