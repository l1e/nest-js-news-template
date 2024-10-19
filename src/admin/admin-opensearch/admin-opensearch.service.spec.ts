import { Test, TestingModule } from '@nestjs/testing';
import { AdminOpensearchService } from './admin-opensearch.service';
import { ConfigModule } from '@nestjs/config';


require("dotenv").config();
describe('AdminOpensearchService', () => {

  console.log('AdminOpensearchService process.env.OPENSERACH_NODE:', process.env.OPENSERACH_NODE)
  console.log('AdminOpensearchService process.env.OPENSEARCH_INITIAL_ADMIN_USERNAME:', process.env.OPENSEARCH_INITIAL_ADMIN_USERNAME)

  let service: AdminOpensearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminOpensearchService],
	  imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : `.env.${process.env.NODE_ENV}`,
		}),
	  ],
    }).compile();

    service = module.get<AdminOpensearchService>(AdminOpensearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
