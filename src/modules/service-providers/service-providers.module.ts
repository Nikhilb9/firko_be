import { Module } from '@nestjs/common';
import { ServiceProvidersController } from './service-providers.controller';
import { ServiceProvidersService } from './service-providers.service';
import { ServiceProvidersRepositoryService } from './service-providers.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ServiceProduct,
  ServiceProductSchema,
} from './schema/service-providers.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/jwt/jwt.config';
import { JwtService as NestJwtService } from '../../common/services/jwt.service';
import { UserRepositoryService } from '../user/user.repository.service';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceProduct.name, schema: ServiceProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [ServiceProvidersController],
  providers: [
    ServiceProvidersService,
    ServiceProvidersRepositoryService,
    NestJwtService,
    UserRepositoryService,
  ],
})
export class ServiceProvidersModule {}
