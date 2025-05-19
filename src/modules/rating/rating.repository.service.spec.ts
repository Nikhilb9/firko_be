import { Test, TestingModule } from '@nestjs/testing';
import { RatingRepositoryService } from './rating.repository.service';

describe('RatingRepositoryService', () => {
  let service: RatingRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingRepositoryService],
    }).compile();

    service = module.get<RatingRepositoryService>(RatingRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
