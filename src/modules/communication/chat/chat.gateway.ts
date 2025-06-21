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
import { ServiceProvidersRepositoryService } from '../../../modules/service-providers/service-providers.repository.service';
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
    try {
      const { productServiceId, roomId, chatContext, message, receiverId } =
        payload;

      const [isRoomExist, isServiceProductExist, isReceiverExist] =
        await Promise.all([
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
        client.emit('error', {
          message: 'Service product does not exist or is not active',
        });
        return;
      }

      if (!isReceiverExist) {
        client.emit('error', {
          message: 'Receiver does not exist',
        });
        return;
      }

      let roomIdToUse = roomId;

      if (!isRoomExist) {
        const newRoom =
          await this.communicationRepoService.createCommunicationRoom(
            payload,
            client.user.id,
          );
        roomIdToUse = String(newRoom._id);
        await this.communicationRepoService.createCommunicationMessage(
          { ...payload, roomId: roomIdToUse },
          client.user.id,
        );
      } else {
        roomIdToUse = roomId || String(isRoomExist._id);
        await Promise.all([
          this.communicationRepoService.createCommunicationMessage(
            { ...payload, roomId: roomIdToUse },
            client.user.id,
          ),
          this.communicationRepoService.updateCommunicationRoom(
            roomIdToUse,
            message,
          ),
        ]);
      }

      this.server.emit('message_send_successfully', {
        roomId: roomIdToUse,
      });

      if (isReceiverExist?.connectionId) {
        this.server.to(isReceiverExist.connectionId).emit('receive_message', {
          productServiceId: productServiceId,
          senderId: client.user.id,
          senderSocketId: client.id,
          roomId: roomIdToUse,
          chatContext: chatContext,
          message: message,
        });
      }
    } catch (error: unknown) {
      client.emit('error', {
        message: 'Failed to send message',
        details: error instanceof Error ? error.message : String(error),
      });
    }

    return;
  }
}
