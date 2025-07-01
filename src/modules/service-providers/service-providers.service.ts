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
import { Types } from 'mongoose';
import { serviceProductCategoryType } from '../../common/constant/service-product-category';
import { ServiceProductCategoryDto } from './dto/get-service-product-category.dto';

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

  /**
   * Update service or product details
   * Allows reactivation of deactivated or sold services/products by setting status to ACTIVE
   * Expired services/products cannot be reactivated
   */
  async updateServiceOrProduct(
    id: string,
    updateData: ICreateServiceProduct,
    userId: string,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid service or product id');
    }

    const isExist = await this.serviceProductRepoSer.getServiceProductById(id);
    if (!isExist || userId !== isExist.userId.toString()) {
      throw new BadRequestException('Service or product not found');
    }

    // Check if the service/product is expired (cannot be reactivated)
    if (isExist.status === ProductOrServiceStatus.EXPIRED) {
      throw new BadRequestException(
        'Cannot update expired service or product. Please create a new one.',
      );
    }

    // If user is trying to reactivate a deactivated or sold service/product
    if (
      (isExist.status === ProductOrServiceStatus.DEACTIVATED ||
        isExist.status === ProductOrServiceStatus.SOLD) &&
      updateData.status === ProductOrServiceStatus.ACTIVE
    ) {
      // Allow reactivation by setting status to ACTIVE
      updateData.status = ProductOrServiceStatus.ACTIVE;
    } else if (
      (isExist.status === ProductOrServiceStatus.DEACTIVATED ||
        isExist.status === ProductOrServiceStatus.SOLD) &&
      !updateData.status
    ) {
      // If no status is provided but service/product is deactivated/sold, keep current status
      delete updateData.status;
    }

    await this.serviceProductRepoSer.updateServiceProduct(id, updateData);
  }

  async getServiceOrProduct(id: string): Promise<IServiceProductResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid service or product id');
    }
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
        firstName: userHwoUploadServiceOrProduct?.firstName ?? '',
        lastName: userHwoUploadServiceOrProduct?.lastName ?? '',
        profileImage: userHwoUploadServiceOrProduct?.profileImage ?? '',
        isEmailVerified:
          userHwoUploadServiceOrProduct?.isEmailVerified ?? false,
        isPhoneVerified:
          userHwoUploadServiceOrProduct?.isPhoneVerified ?? false,
        experience: userHwoUploadServiceOrProduct?.experience ?? 0,
        languages: userHwoUploadServiceOrProduct?.languages,
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

  getServiceProductCategory(): ServiceProductCategoryDto[] {
    return serviceProductCategoryType as ServiceProductCategoryDto[];
  }
}
