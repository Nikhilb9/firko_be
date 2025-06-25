import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { UserRepositoryService } from '../user/user.repository.service';
import { JwtService as NestJwtService } from '../../common/services/jwt.service';
import { SharedJwtModule } from 'src/common/modules/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SharedJwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, NestJwtService, UserRepositoryService],
  exports: [],
})
export class AuthModule {}
