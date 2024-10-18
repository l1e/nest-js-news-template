import { Test, TestingModule } from '@nestjs/testing';
import { AdminOpensearchService } from './admin-opensearch.service';

describe('AdminOpensearchService', () => {
  let service: AdminOpensearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminOpensearchService],
    }).compile();

    service = module.get<AdminOpensearchService>(AdminOpensearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
