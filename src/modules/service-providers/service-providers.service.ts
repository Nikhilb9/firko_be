import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ICreateService,
  IServiceListQuery,
  IServiceListResponse,
  IServiceResponse,
} from './interfaces/service-providers.interface';
import { ServiceRepositoryService } from './service-providers.repository.service';
import { UserRepositoryService } from '../user/user.repository.service';
import { User } from '../user/schemas/user.schema';
import { ServiceStatus } from './enums/service-providers.enum';
import { Service } from './schema/service-providers.schema';
import { Types } from 'mongoose';
import { serviceCategoryType } from '../../common/constant/service-category';
import { ServiceCategoryDto } from './dto/get-service-category.dto';

@Injectable()
export class ServiceProvidersService {
  constructor(
    private readonly serviceRepoSer: ServiceRepositoryService,
    private readonly userRepoService: UserRepositoryService,
  ) {}

  async createService(
    createData: ICreateService,
    userId: string,
  ): Promise<void> {
    const isServiceExist: Service | null =
      await this.serviceRepoSer.getServiceByUserId(userId);

    if (isServiceExist) {
      throw new BadRequestException(
        'Service already exist - at a time only one service can activated or you can update current service',
      );
    }

    delete createData.status;

    await this.serviceRepoSer.createService(createData, userId);
  }

  /**
   * Update service details
   * Allows reactivation of deactivated or sold services by setting status to ACTIVE
   * Expired services cannot be reactivated
   */
  async updateService(
    id: string,
    updateData: ICreateService,
    userId: string,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid service id');
    }

    const isExist = await this.serviceRepoSer.getServiceById(id);
    if (!isExist || userId !== isExist.userId.toString()) {
      throw new BadRequestException('Service not found');
    }

    // Check if the service is expired (cannot be reactivated)
    if (isExist.status === ServiceStatus.EXPIRED) {
      throw new BadRequestException(
        'Cannot update expired service. Please create a new one.',
      );
    }

    // If user is trying to reactivate a deactivated or sold service
    if (
      (isExist.status === ServiceStatus.DEACTIVATED ||
        isExist.status === ServiceStatus.SOLD) &&
      updateData.status === ServiceStatus.ACTIVE
    ) {
      // Allow reactivation by setting status to ACTIVE
      updateData.status = ServiceStatus.ACTIVE;
    } else if (
      (isExist.status === ServiceStatus.DEACTIVATED ||
        isExist.status === ServiceStatus.SOLD) &&
      !updateData.status
    ) {
      // If no status is provided but service is deactivated/sold, keep current status
      delete updateData.status;
    }

    await this.serviceRepoSer.updateService(id, updateData);
  }

  async getService(id: string): Promise<IServiceResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid service id');
    }
    const isExist = await this.serviceRepoSer.getServiceById(id);
    if (!isExist) {
      throw new BadRequestException('Service not found');
    }
    const userHwoUploadService: User | null =
      await this.userRepoService.getUserById(isExist.userId.toString());

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
      skills: isExist.skills,
      availableDays: isExist.availableDays,
      workingHours: isExist.workingHours,
      serviceAreaKM: isExist.serviceAreaKM,
      isVerified: isExist.isVerified,
      status: isExist.status,
      createdAt: isExist?.createdAt ?? new Date(),
      user: {
        id: userHwoUploadService?._id?.toString() ?? '',
        firstName: userHwoUploadService?.firstName ?? '',
        lastName: userHwoUploadService?.lastName ?? '',
        profileImage: userHwoUploadService?.profileImage ?? '',
        languages: userHwoUploadService?.languages,
        phone: userHwoUploadService?.phone ?? '',
        email: userHwoUploadService?.email ?? '',
        gender: userHwoUploadService?.gender ?? '',
        age: userHwoUploadService?.age ?? 0,
      },
    };
  }

  async getUserServiceList(userId: string): Promise<IServiceListResponse[]> {
    return this.serviceRepoSer.getUserServiceList(userId);
  }

  async getAllServiceList(
    filterData: IServiceListQuery,
    currentUserId?: string,
  ): Promise<IServiceListResponse[]> {
    return (
      await this.serviceRepoSer.getAllServiceList(filterData, currentUserId)
    ).map((data) => {
      return {
        id: data.id,
        location: data.location,
        price: data.price,
        title: data.title,
        images: data.images,
        isVerified: data.isVerified,
        status: data.status,
        createdAt: data.createdAt,
      };
    });
  }

  async deleteService(id: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid service id');
    }

    const isExist = await this.serviceRepoSer.getServiceById(id);
    if (!isExist || userId !== isExist.userId.toString()) {
      throw new BadRequestException('Service not found');
    }

    // Mark as deactivated instead of actually deleting
    await this.serviceRepoSer.updateService(id, {
      status: ServiceStatus.DEACTIVATED,
    } as any);
  }

  getServiceCategory(): ServiceCategoryDto[] {
    return serviceCategoryType as ServiceCategoryDto[];
  }
}
