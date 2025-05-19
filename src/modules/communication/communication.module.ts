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
import { jwtConstants } from 'src/config/jwt/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommunicationMessage.name, schema: CommunicationMessageSchema },
      { name: CommunicationRoom.name, schema: CommunicationRoomSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [CommunicationController],
  providers: [CommunicationService, CommunicationRepositoryService],
})
export class CommunicationModule {}
