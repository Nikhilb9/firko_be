import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackRepositoryService } from './feedback.repository.service';
import { Feedback, FeedbackSchema } from './schema/feedback.schema';
import { ServiceProvidersModule } from '../service-providers/service-providers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
    ServiceProvidersModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepositoryService],
  exports: [FeedbackService, FeedbackRepositoryService],
})
export class FeedbackModule {}
