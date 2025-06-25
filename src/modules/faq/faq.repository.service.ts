import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FAQ } from './schema/faq.schema';
import { FAQFilterDto } from './dto/faq.dto';

@Injectable()
export class FAQRepositoryService {
  constructor(
    @InjectModel(FAQ.name)
    private readonly faqModel: Model<FAQ>,
  ) {}

  async createFAQ(data: Partial<FAQ>): Promise<FAQ> {
    return this.faqModel.create(data);
  }

  async getAllFAQs(filter?: FAQFilterDto): Promise<FAQ[]> {
    const query: Record<string, any> = {};

    if (filter?.category) {
      query.category = filter.category;
    }

    if (filter?.isActive !== undefined) {
      query.isActive = filter.isActive;
    }

    if (filter?.tags && filter.tags.length > 0) {
      query.tags = { $in: filter.tags };
    }

    if (filter?.search) {
      const searchRegex = new RegExp(filter.search, 'i');
      query.$or = [{ question: searchRegex }, { answer: searchRegex }];
    }

    return this.faqModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async getFAQById(id: string): Promise<FAQ | null> {
    return this.faqModel.findById(new Types.ObjectId(id)).exec();
  }

  async updateFAQ(id: string, data: Partial<FAQ>): Promise<FAQ | null> {
    return this.faqModel
      .findByIdAndUpdate(new Types.ObjectId(id), data, { new: true })
      .exec();
  }

  async deleteFAQ(id: string): Promise<FAQ | null> {
    return this.faqModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async getFAQsByCategory(category: string): Promise<FAQ[]> {
    return this.faqModel
      .find({ category, isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }
}
