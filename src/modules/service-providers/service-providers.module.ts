import { Module } from '@nestjs/common';
import { ServiceProvidersController } from './service-providers.controller';
import { ServiceProvidersService } from './service-providers.service';
import { ServiceRepositoryService } from './service-providers.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './schema/service-providers.schema';
import { JwtService as NestJwtService } from '../../common/services/jwt.service';
import { UserRepositoryService } from '../user/user.repository.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { SharedJwtModule } from '../../common/modules/jwt.module';

@Module({
  imports: [
    SharedJwtModule,
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ServiceProvidersController],
  providers: [
    ServiceProvidersService,
    ServiceRepositoryService,
    NestJwtService,
    UserRepositoryService,
  ],
  exports: [ServiceProvidersService, ServiceRepositoryService],
})
export class ServiceProvidersModule {}
