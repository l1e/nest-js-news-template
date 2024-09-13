import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserService } from './admin-user.service';

describe('UserService', () => {
  let service: AdminUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminUserService],
    }).compile();

    service = module.get<AdminUserService>(AdminUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
