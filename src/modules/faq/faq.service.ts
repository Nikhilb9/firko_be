import { Injectable, Logger } from '@nestjs/common';
import { FAQ } from './schema/faq.schema';
import { FAQFilterDto } from './dto/faq.dto';
import { FAQRepositoryService } from './faq.repository.service';

@Injectable()
export class FAQService {
  private readonly logger = new Logger(FAQService.name);

  constructor(private readonly faqRepository: FAQRepositoryService) {}

  async getAllFAQs(filter?: FAQFilterDto): Promise<FAQ[]> {
    return this.faqRepository.getAllFAQs(filter);
  }

  async getFAQById(id: string): Promise<FAQ | null> {
    return this.faqRepository.getFAQById(id);
  }

  async getFAQsByCategory(category: string): Promise<FAQ[]> {
    return this.faqRepository.getFAQsByCategory(category);
  }

  async createFAQ(data: Partial<FAQ>): Promise<FAQ> {
    return this.faqRepository.createFAQ(data);
  }

  async updateFAQ(id: string, data: Partial<FAQ>): Promise<FAQ | null> {
    return this.faqRepository.updateFAQ(id, data);
  }

  async deleteFAQ(id: string): Promise<FAQ | null> {
    return this.faqRepository.deleteFAQ(id);
  }
}
