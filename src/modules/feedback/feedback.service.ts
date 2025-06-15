import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FeedbackRepositoryService } from './feedback.repository.service';
import { ICreateFeedback } from './interface/feedback.interface';
import { ServiceProvidersRepositoryService } from '../service-providers/service-providers.repository.service';
import { Types } from 'mongoose';
import { Feedback } from './schema/feedback.schema';
import { FeedbackResponseDto } from './dto/feedback.response.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepo: FeedbackRepositoryService,
    private readonly serviceProviderRepo: ServiceProvidersRepositoryService,
  ) {}

  async createFeedback(userId: string, data: ICreateFeedback): Promise<void> {
    if (data.serviceId) {
      const isServiceExist =
        await this.serviceProviderRepo.getServiceProductById(
          data.serviceId.toString(),
        );

      if (!isServiceExist) {
        throw new NotFoundException('Service not found');
      }

      const existing = await this.feedbackRepo.findUserFeedbackForService(
        data.serviceId.toString(),
        userId,
      );
      if (existing) {
        throw new ConflictException(
          'You have already provided feedback for this service',
        );
      }
    }

    await this.feedbackRepo.createFeedback(userId, data);
  }

  async getAllFeedback(): Promise<FeedbackResponseDto[]> {
    // send pagination in future to get all the feedbacks
    // getAllFeedback(limit,offset)
    const feedbacks = await this.feedbackRepo.getAllFeedback(50, 0);

    return feedbacks.map((feedback) => this.toFeedbackResponseDto(feedback));
  }

  async getFeedbackById(feedbackId: string): Promise<FeedbackResponseDto> {
    const feedback = await this.feedbackRepo.getFeedbackById(feedbackId);

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return this.toFeedbackResponseDto(feedback);
  }

  async getAllFeedbackByUserId(userId: string): Promise<FeedbackResponseDto[]> {
    const feedbacks = await this.feedbackRepo.getAllFeedbackByUserId(userId);
    return feedbacks.map((feedback) => this.toFeedbackResponseDto(feedback));
  }

  private toFeedbackResponseDto(feedback: Feedback): FeedbackResponseDto {
    const response = new FeedbackResponseDto();
    response.id = (feedback._id as Types.ObjectId).toString();
    response.serviceId = feedback.serviceId?.toString();
    response.rating = feedback.rating;
    response.message = feedback.message;
    response.type = feedback.type;
    response.createdAt = feedback.createdAt;
    response.updatedAt = feedback.updatedAt;

    if (feedback.userId) {
      response.userId = feedback.userId._id?.toString();
    }

    return response;
  }
}
