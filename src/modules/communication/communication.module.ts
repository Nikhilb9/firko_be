import { Module } from '@nestjs/common';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { CommunicationRepositoryService } from './communication.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommunicationMessage,
  CommunicationMessageSchema,
} from './schema/cummunication-message.schema';
import {
  CommunicationRoom,
  CommunicationRoomSchema,
} from './schema/communication-room.schema';
import { ChatGateway } from './chat/chat.gateway';
import { User, UserSchema } from '../user/schemas/user.schema';
import { UserRepositoryService } from '../user/user.repository.service';
import { JwtService } from '../../common/services/jwt.service';
import { ServiceRepositoryService } from '../service-providers/service-providers.repository.service';
import {
  Service,
  ServiceSchema,
} from '../service-providers/schema/service-providers.schema';
import { SharedJwtModule } from '../../common/modules/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommunicationMessage.name, schema: CommunicationMessageSchema },
      { name: CommunicationRoom.name, schema: CommunicationRoomSchema },
      { name: User.name, schema: UserSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
    SharedJwtModule,
  ],
  controllers: [CommunicationController],
  providers: [
    CommunicationService,
    CommunicationRepositoryService,
    UserRepositoryService,
    ChatGateway,
    JwtService,
    ServiceRepositoryService,
  ],
})
export class CommunicationModule {}
