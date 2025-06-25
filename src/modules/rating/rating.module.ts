import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingRepositoryService } from './rating.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './schema/rating.schema';
import { ServiceProvidersRepositoryService } from '../service-providers/service-providers.repository.service';
import {
  ServiceProduct,
  ServiceProductSchema,
} from '../service-providers/schema/service-providers.schema';
import { JwtService } from 'src/common/services/jwt.service';
import { SharedJwtModule } from 'src/common/modules/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: ServiceProduct.name, schema: ServiceProductSchema },
    ]),
    SharedJwtModule,
  ],
  controllers: [RatingController],
  providers: [
    RatingService,
    RatingRepositoryService,
    ServiceProvidersRepositoryService,
    JwtService,
  ],
})
export class RatingModule {}
