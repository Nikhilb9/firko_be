import { Module } from '@nestjs/common';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { CommunicationRepositoryService } from './communication.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommunicationMessage,
  CommunicationMessageSchema,
} from './schema/cummunnication-message.schema';
import {
  CommunicationRoom,
  CommunicationRoomSchema,
} from './schema/communication-room.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../config/config';
import { ChatGateway } from './chat/chat.gateway';
import { User, UserSchema } from '../user/schemas/user.schema';
import { UserRepositoryService } from '../user/user.repository.service';
import { JwtService } from '../../common/services/jwt.service';
import { ServiceProvidersRepositoryService } from '../service-providers/service-providers.repository.service';
import {
  ServiceProduct,
  ServiceProductSchema,
} from '../service-providers/schema/service-providers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommunicationMessage.name, schema: CommunicationMessageSchema },
      { name: CommunicationRoom.name, schema: CommunicationRoomSchema },
      { name: User.name, schema: UserSchema },
      { name: ServiceProduct.name, schema: ServiceProductSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [CommunicationController],
  providers: [
    CommunicationService,
    CommunicationRepositoryService,
    UserRepositoryService,
    ChatGateway,
    JwtService,
    ServiceProvidersRepositoryService,
  ],
})
export class CommunicationModule {}
