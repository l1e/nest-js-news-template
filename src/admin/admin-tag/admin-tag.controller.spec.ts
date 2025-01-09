import { Test, TestingModule } from '@nestjs/testing';
import { AdminTagController } from './admin-tag.controller';
import { AdminTagService } from './admin-tag.service';

describe('AdminTagController', () => {
  let controller: AdminTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminTagController],
        providers: [
        {
            provide: AdminTagService,
            useValue: {
                createTag: jest.fn(),
                getTagById: jest.fn(),
                getAllTags: jest.fn(),
                updateTag: jest.fn(),
                deleteTag: jest.fn(),
            },
        },
    ],
    }).compile();

    controller = module.get<AdminTagController>(AdminTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
