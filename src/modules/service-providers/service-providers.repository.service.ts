import { Injectable } from '@nestjs/common';
import { Service } from './schema/service-providers.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ICreateService,
  IServiceListQuery,
  IServiceListResponse,
} from './interfaces/service-providers.interface';
import { ServiceStatus } from './enums/service-providers.enum';
import type { PipelineStage } from 'mongoose';

@Injectable()
export class ServiceRepositoryService {
  constructor(
    @InjectModel(Service.name)
    private readonly serviceSchema: Model<Service>,
  ) {}

  async createService(
    createData: ICreateService,
    userId: string,
  ): Promise<void> {
    await this.serviceSchema.create({
      ...createData,
      userId: new Types.ObjectId(userId),
      geoLocation: {
        type: 'Point',
        coordinates: [createData.longitude, createData.latitude],
      },
    });
  }

  async updateService(id: string, updateData: ICreateService): Promise<void> {
    await this.serviceSchema.updateOne(
      { _id: new Types.ObjectId(id) },
      updateData,
    );
  }
  async getServiceById(id: string): Promise<Service | null> {
    return this.serviceSchema.findById(id);
  }
  async getServiceByUserId(userId: string): Promise<Service | null> {
    return this.serviceSchema.findOne({
      userId: new Types.ObjectId(userId),
    });
  }

  async getUserServiceList(userId: string): Promise<IServiceListResponse[]> {
    const docs: Service[] = await this.serviceSchema
      .find<Service>({ userId: new Types.ObjectId(userId) })
      .select('_id location price title images isVerified type status')
      .lean();

    return docs.map((doc) => ({
      id: doc?._id?.toString() ?? '',
      location: doc.location,
      price: doc.price,
      title: doc.title,
      images: doc.images,
      isVerified: doc.isVerified,
      status: doc.status,
      createdAt: doc.createdAt ?? new Date(),
    }));
  }

  async getAllServiceList(
    filterData: IServiceListQuery,
    currentUserId?: string,
  ): Promise<IServiceListResponse[]> {
    const page = filterData.page ?? 1;
    const limit = filterData.limit ?? 10;
    const skip = (page - 1) * limit;

    const matchFilter: Record<string, any> = {
      ...{ status: ServiceStatus.ACTIVE },
      ...(filterData.category && { category: filterData.category }),
      ...(filterData.search && {
        $or: [
          { title: { $regex: filterData.search, $options: 'i' } },
          { description: { $regex: filterData.search, $options: 'i' } },
          { skills: { $in: [new RegExp(filterData.search, 'i')] } },
          { category: { $regex: filterData.search, $options: 'i' } },
        ],
      }),
      ...(currentUserId && {
        userId: { $ne: new Types.ObjectId(currentUserId) },
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
        createdAt: 1,
      },
    });

    pipeline.push({ $skip: Number(skip) });
    pipeline.push({ $limit: Number(limit) });

    return this.serviceSchema.aggregate(pipeline);
  }
}
