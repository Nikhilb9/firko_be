import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RatingRepositoryService } from './rating.repository.service';
import { ICreateRating, IRatingResponse } from './interface/rating.interface';
import { ServiceRepositoryService } from '../service-providers/service-providers.repository.service';
import { Types } from 'mongoose';

@Injectable()
export class RatingService {
  constructor(
    private readonly ratingRepo: RatingRepositoryService,
    private readonly serviceProviderRepo: ServiceRepositoryService,
  ) {}
  async giveRating(userId: string, data: ICreateRating): Promise<void> {
    const isServiceExist = await this.serviceProviderRepo.getServiceById(
      data.serviceId.toString(),
    );

    if (!isServiceExist) {
      throw new NotFoundException('Service id not exist');
    }

    const existing = await this.ratingRepo.findUserRatingForService(
      data.serviceId.toString(),
      userId,
    );
    if (existing) {
      throw new ConflictException('You have already rated this service');
    }
    await this.ratingRepo.createRating(userId, {
      ...data,
      serviceId: new Types.ObjectId(data.serviceId),
    });
  }
  async getRatings(serviceId: string): Promise<IRatingResponse[]> {
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new BadRequestException('Invalid service id');
    }
    return this.ratingRepo.getAllRatingForService(serviceId);
  }
}
