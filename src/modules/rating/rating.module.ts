import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingRepositoryService } from './rating.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './schema/rating.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/jwt/jwt.config';
import { ServiceProvidersRepositoryService } from '../service-providers/service-providers.repository.service';
import {
  ServiceProduct,
  ServiceProductSchema,
} from '../service-providers/schema/service-providers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: ServiceProduct.name, schema: ServiceProductSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [RatingController],
  providers: [
    RatingService,
    RatingRepositoryService,
    ServiceProvidersRepositoryService,
  ],
})
export class RatingModule {}
