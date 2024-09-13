import { Test, TestingModule } from '@nestjs/testing';
import { AdminMediaController } from './admin-media.controller';

describe('AdminMediaController', () => {
  let controller: AdminMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminMediaController],
    }).compile();

    controller = module.get<AdminMediaController>(AdminMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
