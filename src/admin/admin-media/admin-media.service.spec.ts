import { Test, TestingModule } from '@nestjs/testing';
import { AdminMediaService } from './admin-media.service';

describe('AdminMediaService', () => {
  let service: AdminMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminMediaService],
    }).compile();

    service = module.get<AdminMediaService>(AdminMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
