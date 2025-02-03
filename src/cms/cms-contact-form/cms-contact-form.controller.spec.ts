import { Test, TestingModule } from '@nestjs/testing';
import { CmsContactFormController } from './cms-contact-form.controller';

describe('CmsContactFormController', () => {
  let controller: CmsContactFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CmsContactFormController],
    }).compile();

    controller = module.get<CmsContactFormController>(CmsContactFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
