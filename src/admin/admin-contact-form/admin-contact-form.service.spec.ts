import { Test, TestingModule } from '@nestjs/testing';
import { AdminContactFormService } from './admin-contact-form.service';

describe('AdminContactFormService', () => {
  let service: AdminContactFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminContactFormService],
    }).compile();

    service = module.get<AdminContactFormService>(AdminContactFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
