import { Test, TestingModule } from '@nestjs/testing';
import { AdminTagService } from './admin-tag.service';
import { getModelToken } from '@nestjs/sequelize';
import { Tag } from './model/tag.model';

describe('AdminTagService', () => {
  let service: AdminTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminTagService,
        {
            provide: getModelToken(Tag),
            useValue: {
                create: jest.fn(),
                findByPk: jest.fn(),
                findAll: jest.fn(),
                destroy: jest.fn(),
                count: jest.fn(), 
            },
        },
    ],
      
    }).compile();

    service = module.get<AdminTagService>(AdminTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
