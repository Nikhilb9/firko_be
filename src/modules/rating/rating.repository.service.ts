import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Rating } from './schema/rating.schema';
import {
  ICreateRating,
  IPopulatedRating,
  IRatingResponse,
} from './interface/rating.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RatingRepositoryService {
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
  ) {}
  async getAllRatingForService(serviceId: string): Promise<IRatingResponse[]> {
    const ratings = await this.ratingModel
      .find({
        serviceId: new Types.ObjectId(serviceId),
      })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName profileImage')
      .lean<IPopulatedRating[]>();

    return ratings.map(({ userId: user, rating, comment }) => ({
      rating,
      comment,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
    }));
  }
  async createRating(userId: string, dto: ICreateRating) {
    return this.ratingModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
  }
  async findUserRatingForService(serviceId: string, userId: string) {
    const data = await this.ratingModel.findOne({
      serviceId: new Types.ObjectId(serviceId),
      userId: new Types.ObjectId(userId),
    });
    return data;
  }
}
