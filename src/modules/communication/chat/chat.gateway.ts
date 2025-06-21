import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UseGuards } from '@nestjs/common';
import { UserRepositoryService } from '../../user/user.repository.service';
import { WsJwtGuard } from './ws-jwt.guard';
import { AuthenticatedSocket } from '../interface/chat.interface';
import { CommunicationRepositoryService } from '../communication.repository.service';
import { JwtService } from '../../../common/services/jwt.service';
import { Types } from 'mongoose';
import { CommunicationRoom } from '../schema/communication-room.schema';
import { ServiceProvidersRepositoryService } from '../../../modules/service-providers/service-providers.repository.service';
import { ServiceProduct } from '../../../modules/service-providers/schema/service-providers.schema';
import { User } from '../../../modules/user/schemas/user.schema';
import { ProductOrServiceStatus } from '../../../modules/service-providers/enums/service-providers.enum';

@WebSocketGateway({ cors: true })
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userRepoService: UserRepositoryService,
    private readonly communicationRepoService: CommunicationRepositoryService,
    private readonly jwtService: JwtService,
    private readonly serviceProvidersRepositoryService: ServiceProvidersRepositoryService,
  ) {}

  async handleDisconnect(client: AuthenticatedSocket) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload: { id: string } | null = await this.jwtService.verify(
        client?.handshake?.query?.token as string,
      );

      if (payload?.id && Types.ObjectId.isValid(payload.id)) {
        await this.userRepoService.updateUserConnectionId(null, payload.id);
        return client.emit('disconnected', {
          message: 'Disconnected successfully',
          userId: payload?.id,
          socketId: client.id,
        });
      }
    } catch {
      return client.emit('error', {
        message: 'Token expired',
      });
    }
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload: { id: string } | null = await this.jwtService.verify(
        client?.handshake?.query?.token as string,
      );

      if (payload?.id && Types.ObjectId.isValid(payload.id)) {
        await this.userRepoService.updateUserConnectionId(
          client.id,
          payload.id,
        );
        return client.emit('connected', {
          message: 'Connected successfully',
          userId: payload.id,
          socketId: client.id,
        });
      }
    } catch {
      return client.emit('error', {
        message: 'Token expired',
      });
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(client: AuthenticatedSocket, payload: CreateMessageDto) {
    const { productServiceId, roomId, chatContext, message, receiverId } =
      payload;

    // eslint-disable-next-line prefer-const
    let [isRoomExist, isServiceProductExist, isReceiverExist]: [
      CommunicationRoom | null,
      ServiceProduct | null,
      User | null,
    ] = await Promise.all([
      this.communicationRepoService.getCommunicationRoom(
        client.user.id,
        receiverId,
        productServiceId,
      ),
      this.serviceProvidersRepositoryService.getServiceProductById(
        productServiceId,
      ),
      this.userRepoService.getUserById(receiverId),
    ]);

    if (
      !isServiceProductExist ||
      isServiceProductExist.status !== ProductOrServiceStatus.ACTIVE
    ) {
      return client.emit('error', {
        message: 'Service product id not exist',
      });
    }

    if (!isReceiverExist) {
      return client.emit('error', {
        message: 'Receiver not exists',
      });
    }

    if (!isRoomExist) {
      isRoomExist = await this.communicationRepoService.createCommunicationRoom(
        payload,
        client.user.id,
      );
      await this.communicationRepoService.createCommunicationMessage(
        { ...payload, roomId: String(isRoomExist._id) },
        client.user.id,
      );
    } else {
      await Promise.all([
        this.communicationRepoService.createCommunicationMessage(
          payload,
          client.user.id,
        ),
        this.communicationRepoService.updateCommunicationRoom(
          roomId as string,
          message,
        ),
      ]);
    }
    client.emit('message_send_successfully', {
      roomId: String(isRoomExist._id),
    });

    if (isReceiverExist?.connectionId) {
      this.server.to(isReceiverExist.connectionId).emit('receive_message', {
        productServiceId: productServiceId,
        senderId: client.user.id,
        senderSocketId: client.id,
        roomId: roomId,
        chatContext: chatContext,
        message: message,
      });
    }

    return;
  }
}
