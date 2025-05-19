import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationRepositoryService } from './communication.repository.service';

describe('CommunicationRepositoryService', () => {
  let service: CommunicationRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunicationRepositoryService],
    }).compile();

    service = module.get<CommunicationRepositoryService>(
      CommunicationRepositoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
