import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { Types } from 'mongoose';
import { FeedbackType } from './enum';

describe('FeedbackController', () => {
  let controller: FeedbackController;

  const mockFeedbackService = {
    createFeedback: jest.fn(),
    getFeedback: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: mockFeedbackService,
        },
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
    service = module.get<FeedbackService>(FeedbackService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFeedback', () => {
    const mockRequest = {
      user: { id: 'user123' },
    };

    const mockCreateFeedbackDto = {
      serviceId: new Types.ObjectId(),
      rating: 4,
      message: 'Great service!',
      type: FeedbackType.GENERAL,
    };

    it('should create feedback successfully', async () => {
      mockFeedbackService.createFeedback.mockResolvedValue(undefined);

      const result = await controller.createFeedback(
        mockRequest as any,
        mockCreateFeedbackDto,
      );

      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Feedback created successfully');
      expect(mockFeedbackService.createFeedback).toHaveBeenCalledWith(
        mockRequest.user.id,
        mockCreateFeedbackDto,
      );
    });
  });

  describe('getFeedback', () => {
    const serviceId = new Types.ObjectId().toString();
    const mockFeedbackResponse = [
      {
        id: new Types.ObjectId().toString(),
        serviceId: new Types.ObjectId().toString(),
        rating: 4,
        message: 'Great service!',
        type: FeedbackType.GENERAL,
        userId: {
          id: new Types.ObjectId().toString(),
          name: 'John Doe',
          email: 'john@example.com',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return feedback list successfully', async () => {
      mockFeedbackService.getFeedback.mockResolvedValue(mockFeedbackResponse);

      const result = await controller.getFeedback(serviceId);

      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(mockFeedbackResponse);
      expect(mockFeedbackService.getFeedback).toHaveBeenCalledWith(serviceId);
    });
  });
});
