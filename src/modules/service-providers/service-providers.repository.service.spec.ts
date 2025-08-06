import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRepositoryService } from './service-providers.repository.service';

describe('ServiceProvidersRepositoryService', () => {
  let service: ServiceRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceRepositoryService],
    }).compile();

    service = module.get<ServiceRepositoryService>(ServiceRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
