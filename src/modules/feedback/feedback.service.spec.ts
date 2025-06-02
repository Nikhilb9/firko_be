import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { FeedbackRepositoryService } from './feedback.repository.service';
import { ServiceProvidersRepositoryService } from '../service-providers/service-providers.repository.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { FeedbackType } from './enum';

describe('FeedbackService', () => {
  let service: FeedbackService;

  const mockFeedbackRepo = {
    createFeedback: jest.fn(),
    findUserFeedbackForService: jest.fn(),
    getAllFeedbackForService: jest.fn(),
  };

  const mockServiceProviderRepo = {
    getServiceProductById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: FeedbackRepositoryService,
          useValue: mockFeedbackRepo,
        },
        {
          provide: ServiceProvidersRepositoryService,
          useValue: mockServiceProviderRepo,
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFeedback', () => {
    const userId = 'user123';
    const mockFeedbackData = {
      serviceId: new Types.ObjectId(),
      rating: 4,
      message: 'Great service!',
      type: FeedbackType.GENERAL,
    };

    it('should create feedback successfully', async () => {
      mockServiceProviderRepo.getServiceProductById.mockResolvedValue({
        id: 'service123',
      });
      mockFeedbackRepo.findUserFeedbackForService.mockResolvedValue(null);
      mockFeedbackRepo.createFeedback.mockResolvedValue(undefined);

      await service.createFeedback(userId, mockFeedbackData);

      expect(
        mockServiceProviderRepo.getServiceProductById,
      ).toHaveBeenCalledWith(mockFeedbackData.serviceId.toString());
      expect(mockFeedbackRepo.findUserFeedbackForService).toHaveBeenCalledWith(
        mockFeedbackData.serviceId.toString(),
        userId,
      );
      expect(mockFeedbackRepo.createFeedback).toHaveBeenCalled();
    });

    it('should throw NotFoundException when service does not exist', async () => {
      mockServiceProviderRepo.getServiceProductById.mockResolvedValue(null);

      await expect(
        service.createFeedback(userId, mockFeedbackData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when user has already provided feedback', async () => {
      mockServiceProviderRepo.getServiceProductById.mockResolvedValue({
        id: 'service123',
      });
      mockFeedbackRepo.findUserFeedbackForService.mockResolvedValue({
        id: 'existing',
      });

      await expect(
        service.createFeedback(userId, mockFeedbackData),
      ).rejects.toThrow(ConflictException);
    });
  });
});
