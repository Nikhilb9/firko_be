import { Test, TestingModule } from '@nestjs/testing';
import { ServiceProvidersRepositoryService } from './service-providers.repository.service';

describe('ServiceProvidersRepositoryService', () => {
  let service: ServiceProvidersRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceProvidersRepositoryService],
    }).compile();

    service = module.get<ServiceProvidersRepositoryService>(ServiceProvidersRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
