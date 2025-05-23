import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ICreateServiceProduct,
  IServiceProductListQuery,
  IServiceProductListResponse,
  IServiceProductResponse,
} from './interfaces/service-providers.interface';
import { ServiceProvidersRepositoryService } from './service-providers.repository.service';
import { UserRepositoryService } from '../user/user.repository.service';
import { User } from '../user/schemas/user.schema';
import {
  ProductOrServiceStatus,
  ServiceProductType,
} from './enums/service-providers.enum';
import { ServiceProduct } from './schema/service-providers.schema';

@Injectable()
export class ServiceProvidersService {
  constructor(
    private readonly serviceProductRepoSer: ServiceProvidersRepositoryService,
    private readonly userRepoService: UserRepositoryService,
  ) {}

  async createServiceOrProduct(
    createData: ICreateServiceProduct,
    userId: string,
  ): Promise<void> {
    if (createData.type === ServiceProductType.SERVICE) {
      const isServiceExist: ServiceProduct | null =
        await this.serviceProductRepoSer.getServiceByUserId(userId);

      if (isServiceExist) {
        throw new BadRequestException(
          'Service already exist - at a time only one service can activated or you can update current service',
        );
      }
    }

    delete createData.status;

    await this.serviceProductRepoSer.createServiceProduct(createData, userId);
  }

  async updateServiceOrProduct(
    id: string,
    updateData: ICreateServiceProduct,
    userId: string,
  ): Promise<void> {
    const isExist = await this.serviceProductRepoSer.getServiceProductById(id);
    if (
      !isExist ||
      userId !== isExist.userId.toString() ||
      [
        ProductOrServiceStatus.DEACTIVATED,
        ProductOrServiceStatus.SOLD,
        ProductOrServiceStatus.EXPIRED,
      ].includes(isExist.status)
    ) {
      throw new BadRequestException(
        'Service or product not found or sold or expired or deactivated',
      );
    }

    await this.serviceProductRepoSer.updateServiceProduct(id, updateData);
  }

  async getServiceOrProduct(id: string): Promise<IServiceProductResponse> {
    const isExist = await this.serviceProductRepoSer.getServiceProductById(id);
    if (!isExist) {
      throw new BadRequestException('Service or product not found');
    }
    const userHwoUploadServiceOrProduct: User | null =
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
      type: isExist.type,
      skills: isExist.skills,
      availableDays: isExist.availableDays,
      workingHours: isExist.workingHours,
      serviceAreaKM: isExist.serviceAreaKM,
      isVerified: isExist.isVerified,
      createdAt: isExist?.createdAt ?? new Date(),
      user: {
        id: userHwoUploadServiceOrProduct?._id?.toString() ?? '',
        first_name: userHwoUploadServiceOrProduct?.firstName ?? '',
        last_name: userHwoUploadServiceOrProduct?.lastName ?? '',
        profileImage: userHwoUploadServiceOrProduct?.profileImage ?? '',
        isVerified: userHwoUploadServiceOrProduct?.isVerified ?? false,
      },
    };
  }

  async getUserProductAndServiceList(
    userId: string,
  ): Promise<IServiceProductListResponse[]> {
    return this.serviceProductRepoSer.getUserServiceAndProductList(userId);
  }

  async getAllProductAndServiceList(
    filterData: IServiceProductListQuery,
  ): Promise<IServiceProductListResponse[]> {
    return (
      await this.serviceProductRepoSer.getAllServiceAndProductList(filterData)
    ).map((data) => {
      return {
        id: data.id,
        location: data.location,
        price: data.price,
        title: data.title,
        images: data.images,
        isVerified: data.isVerified,
        type: data.type,
        status: data.status,
      };
    });
  }
}
