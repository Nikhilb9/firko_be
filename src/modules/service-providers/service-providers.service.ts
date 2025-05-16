import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ICreateServiceProduct,
  IServiceProductResponse,
} from './interfaces/service-providers.interface';
import { ServiceProvidersRepositoryService } from './service-providers.repository.service';

@Injectable()
export class ServiceProvidersService {
  constructor(
    private readonly serviceProductRepoSer: ServiceProvidersRepositoryService,
  ) {}

  async createServiceOrProduct(
    createData: ICreateServiceProduct,
    userId: string,
  ): Promise<void> {
    const isServiceExist: ICreateServiceProduct | null =
      await this.serviceProductRepoSer.getServiceByUserId(userId);

    if (isServiceExist) {
      throw new BadRequestException('Service already exist');
    }

    await this.serviceProductRepoSer.createServiceProduct(createData, userId);
  }

  async updateServiceOrProduct(
    id: string,
    updateData: ICreateServiceProduct,
    userId: string,
  ): Promise<void> {
    const isExist = await this.serviceProductRepoSer.getServiceProductById(id);
    if (!isExist) {
      throw new BadRequestException('Service or product not found');
    }

    if (userId !== isExist.userId.toString()) {
      throw new BadRequestException('Service or product not found');
    }

    await this.serviceProductRepoSer.updateServiceProduct(id, updateData);
  }

  async getServiceOrProduct(id: string): Promise<IServiceProductResponse> {
    const isExist = await this.serviceProductRepoSer.getServiceProductById(id);
    if (!isExist) {
      throw new BadRequestException('Service or product not found');
    }
    return {
      id: isExist._id?.toString() ?? '',
      location: isExist.location,
      longitude: isExist.longitude,
      latitude: isExist.latitude,
      price: isExist.price,
      title: isExist.title,
      description: isExist.description,
      images: isExist.images,
      category: isExist.category,
      type: isExist.type,
      skills: isExist.skills,
      availableDays: isExist.availableDays,
      workingHours: isExist.workingHours,
      serviceAreaKM: isExist.serviceAreaKM,
      isVerified: isExist.isVerified,
      createdAt: isExist.createdAt ?? new Date(),
    };
  }
}
