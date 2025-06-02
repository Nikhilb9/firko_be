import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackRepositoryService } from './feedback.repository.service';
import { getModelToken } from '@nestjs/mongoose';
import { Feedback } from './schema/feedback.schema';
import { Types } from 'mongoose';
import { FeedbackType } from './enum';

describe('FeedbackRepositoryService', () => {
  let service: FeedbackRepositoryService;

  const mockFeedbackModel = {
    create: jest.fn(),
    findOne: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackRepositoryService,
        {
          provide: getModelToken(Feedback.name),
          useValue: mockFeedbackModel,
        },
      ],
    }).compile();

    service = module.get<FeedbackRepositoryService>(FeedbackRepositoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFeedback', () => {
    it('should create feedback successfully', async () => {
      const userId = 'user123';
      const feedbackData = {
        serviceId: new Types.ObjectId(),
        rating: 4,
        message: 'Great service!',
        type: FeedbackType.GENERAL,
      };

      mockFeedbackModel.create.mockResolvedValue(undefined);

      await service.createFeedback(userId, feedbackData);

      expect(mockFeedbackModel.create).toHaveBeenCalledWith({
        ...feedbackData,
        userId: new Types.ObjectId(userId),
      });
    });
  });

  describe('findUserFeedbackForService', () => {
    it('should find user feedback for service', async () => {
      const serviceId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();
      const mockExec = jest.fn();

      mockFeedbackModel.findOne.mockReturnValue({ exec: mockExec });
      mockExec.mockResolvedValue({ id: 'feedback123' });

      const result = await service.findUserFeedbackForService(
        serviceId,
        userId,
      );

      expect(mockFeedbackModel.findOne).toHaveBeenCalledWith({
        serviceId: new Types.ObjectId(serviceId),
        userId: new Types.ObjectId(userId),
      });
      expect(result).toEqual({ id: 'feedback123' });
    });
  });

  describe('getAllFeedbackForService', () => {
    it('should get all feedback for service', async () => {
      const serviceId = new Types.ObjectId().toString();
      const mockPopulate = jest.fn();
      const mockSort = jest.fn();
      const mockExec = jest.fn();

      mockFeedbackModel.find.mockReturnValue({ populate: mockPopulate });
      mockPopulate.mockReturnValue({ sort: mockSort });
      mockSort.mockReturnValue({ exec: mockExec });
      mockExec.mockResolvedValue([{ id: 'feedback123' }]);

      const result = await service.getAllFeedback();

      expect(mockFeedbackModel.find).toHaveBeenCalledWith({
        serviceId: new Types.ObjectId(serviceId),
      });
      expect(mockPopulate).toHaveBeenCalledWith('userId', 'name email');
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual([{ id: 'feedback123' }]);
    });
  });
});
