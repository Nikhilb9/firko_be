import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FAQController } from './faq.controller';
import { FAQService } from './faq.service';
import { FAQRepositoryService } from './faq.repository.service';
import { FAQ, FAQSchema } from './schema/faq.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FAQ.name, schema: FAQSchema }])],
  controllers: [FAQController],
  providers: [FAQService, FAQRepositoryService],
  exports: [FAQService],
})
export class FAQModule {}
