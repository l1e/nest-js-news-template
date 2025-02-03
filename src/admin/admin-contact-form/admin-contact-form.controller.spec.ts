import { Test, TestingModule } from '@nestjs/testing';
import { AdminContactFormController } from './admin-contact-form.controller';

describe('AdminContactFormController', () => {
  let controller: AdminContactFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminContactFormController],
    }).compile();

    controller = module.get<AdminContactFormController>(AdminContactFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
