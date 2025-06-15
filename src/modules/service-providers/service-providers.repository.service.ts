import { Injectable } from '@nestjs/common';
import { ServiceProduct } from './schema/service-providers.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ICreateServiceProduct,
  IServiceProductListQuery,
  IServiceProductListResponse,
} from './interfaces/service-providers.interface';
import {
  ProductOrServiceStatus,
  ServiceProductType,
} from './enums/service-providers.enum';
import type { PipelineStage } from 'mongoose';

@Injectable()
export class ServiceProvidersRepositoryService {
  constructor(
    @InjectModel(ServiceProduct.name)
    private readonly serviceProductSchema: Model<ServiceProduct>,
  ) {}

  async createServiceProduct(
    createData: ICreateServiceProduct,
    userId: string,
  ): Promise<void> {
    await this.serviceProductSchema.create({
      ...createData,
      userId: new Types.ObjectId(userId),
      geoLocation: {
        type: 'Point',
        coordinates: [createData.longitude, createData.latitude],
      },
    });
  }

  async updateServiceProduct(
    id: string,
    updateData: ICreateServiceProduct,
  ): Promise<void> {
    await this.serviceProductSchema.updateOne(
      { _id: new Types.ObjectId(id) },
      updateData,
    );
  }
  async getServiceProductById(id: string): Promise<ServiceProduct | null> {
    return this.serviceProductSchema.findById(id);
  }
  async getServiceByUserId(userId: string): Promise<ServiceProduct | null> {
    return this.serviceProductSchema.findOne({
      userId: new Types.ObjectId(userId),
      type: ServiceProductType.SERVICE,
    });
  }

  async getUserServiceAndProductList(
    userId: string,
  ): Promise<IServiceProductListResponse[]> {
    const docs: ServiceProduct[] = await this.serviceProductSchema
      .find<ServiceProduct>({ userId: new Types.ObjectId(userId) })
      .select('_id location price title images isVerified type status')
      .lean();

    return docs.map((doc) => ({
      id: doc?._id?.toString() ?? '',
      location: doc.location,
      price: doc.price,
      title: doc.title,
      images: doc.images,
      isVerified: doc.isVerified,
      type: doc.type,
      status: doc.status,
    }));
  }

  async getAllServiceAndProductList(
    filterData: IServiceProductListQuery,
  ): Promise<IServiceProductListResponse[]> {
    const page = filterData.page ?? 1;
    const limit = filterData.limit ?? 10;
    const skip = (page - 1) * limit;

    const matchFilter: Record<string, any> = {
      ...(filterData.type && { type: filterData.type }),
      ...{ status: ProductOrServiceStatus.ACTIVE },
      ...(filterData.category && { category: filterData.category }),
      ...(filterData.search && {
        $or: [
          { title: { $regex: filterData.search, $options: 'i' } },
          { description: { $regex: filterData.search, $options: 'i' } },
          { skills: { $in: [new RegExp(filterData.search, 'i')] } },
          { category: { $regex: filterData.search, $options: 'i' } },
        ],
      }),
    };

    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [
            parseFloat(filterData.longitude!),
            parseFloat(filterData.latitude!),
          ],
        },
        distanceField: 'distance',
        spherical: true,
        query: matchFilter,
      },
    });

    pipeline.push({
      $project: {
        id: '$_id',
        location: 1,
        price: 1,
        title: 1,
        images: 1,
        isVerified: 1,
        distance: 1,
      },
    });

    pipeline.push({ $skip: Number(skip) });
    pipeline.push({ $limit: Number(limit) });

    return this.serviceProductSchema.aggregate(pipeline);
  }
}
