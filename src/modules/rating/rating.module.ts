import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingRepositoryService } from './rating.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './schema/rating.schema';
import { ServiceRepositoryService } from '../service-providers/service-providers.repository.service';
import {
  Service,
  ServiceSchema,
} from '../service-providers/schema/service-providers.schema';
import { JwtService } from '../../common/services/jwt.service';
import { SharedJwtModule } from '../../common/modules/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
    SharedJwtModule,
  ],
  controllers: [RatingController],
  providers: [
    RatingService,
    RatingRepositoryService,
    ServiceRepositoryService,
    JwtService,
  ],
})
export class RatingModule {}
