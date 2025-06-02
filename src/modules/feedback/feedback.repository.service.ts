import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feedback } from './schema/feedback.schema';
import { ICreateFeedback } from './interface/feedback.interface';

@Injectable()
export class FeedbackRepositoryService {
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<Feedback>,
  ) {}

  async createFeedback(userId: string, data: ICreateFeedback): Promise<void> {
    await this.feedbackModel.create({
      ...data,
      userId: new Types.ObjectId(userId),
    });
  }

  async findUserFeedbackForService(
    serviceId: string,
    userId: string,
  ): Promise<Feedback | null> {
    return this.feedbackModel
      .findOne({
        serviceId: new Types.ObjectId(serviceId),
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  async getAllFeedback(
    limit: number = 50,
    offset: number = 0,
  ): Promise<Feedback[]> {
    return this.feedbackModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();
  }

  async getFeedbackById(feedbackId: string): Promise<Feedback | null> {
    return this.feedbackModel.findById(feedbackId).exec();
  }

  async getFeedbackCount(): Promise<number> {
    return this.feedbackModel.countDocuments().exec();
  }
}
