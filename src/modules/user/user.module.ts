import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepositoryService } from './user.repository.service';
import { JwtService as NestJwtService } from '../../common/services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../config/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepositoryService, NestJwtService],
})
export class UserModule {}
