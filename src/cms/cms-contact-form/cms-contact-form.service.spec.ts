import { Test, TestingModule } from '@nestjs/testing';
import { CmsContactFormService } from './cms-contact-form.service';

describe('CmsContactFormService', () => {
  let service: CmsContactFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CmsContactFormService],
    }).compile();

    service = module.get<CmsContactFormService>(CmsContactFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
