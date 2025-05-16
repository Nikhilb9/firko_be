import { Injectable } from '@nestjs/common';
import { ServiceProduct } from './schema/service-providers.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICreateServiceProduct } from './interfaces/service-providers.interface';
import { ServiceProductType } from './enums/service-providers.enum';
// import { ServiceProductListQueryDto } from './dto/list-query-service-providers.dto';

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
    return this.serviceProductSchema.findById(new Types.ObjectId(id));
  }
  async getServiceByUserId(userId: string): Promise<ServiceProduct | null> {
    return this.serviceProductSchema.findOne({
      userId: new Types.ObjectId(userId),
      type: ServiceProductType.SERVICE,
    });
  }
  // async getServiceProductListbByFilterAndPagination(
  //   filterData: ServiceProductListQueryDto,
  // ): Promise<ServiceProduct[]> {

  // }
}
