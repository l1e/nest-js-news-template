import { Test, TestingModule } from '@nestjs/testing';
import { AdminOpensearchController } from './admin-opensearch.controller';

describe('AdminOpensearchController', () => {
  let controller: AdminOpensearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminOpensearchController],
    }).compile();

    controller = module.get<AdminOpensearchController>(AdminOpensearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
