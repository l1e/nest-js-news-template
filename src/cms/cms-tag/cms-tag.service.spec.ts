import { Test, TestingModule } from '@nestjs/testing';
import { CmsTagService } from './cms-tag.service';
import { DatabaseModule } from './../../../src/database/database.module';
import { AdminTagService } from './../../../src/admin/admin-tag/admin-tag.service';

describe('CmsTagService', () => {
  let service: CmsTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CmsTagService, AdminTagService],
      imports: [DatabaseModule],
    }).compile();

    service = module.get<CmsTagService>(CmsTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
