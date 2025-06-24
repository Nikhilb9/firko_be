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

  // Map to track connected users: userId -> socketId
  private readonly connectedUsers = new Map<string, string>();

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
        // Remove from connected users map
        this.connectedUsers.delete(payload.id);

        await this.userRepoService.updateUserConnectionId(null, payload.id);

        // Notify relevant users about offline status
        const userRooms = await this.communicationRepoService.getUserRoomIds(
          payload.id,
        );
        for (const roomId of userRooms) {
          const room = await this.communicationRepoService.getRoomById(roomId);
          if (!room) continue;

          const otherUserId =
            room.senderId.toString() === payload.id
              ? room.receiverId.toString()
              : room.senderId.toString();

          const otherUser = await this.userRepoService.getUserById(otherUserId);
          if (otherUser?.connectionId) {
            this.server.to(otherUser.connectionId).emit('user_status_changed', {
              userId: payload.id,
              status: 'OFFLINE',
            });
          }
        }

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
        // Store in connected users map
        this.connectedUsers.set(payload.id, client.id);

        await this.userRepoService.updateUserConnectionId(
          client.id,
          payload.id,
        );

        // Notify relevant users about online status
        const userRooms = await this.communicationRepoService.getUserRoomIds(
          payload.id,
        );
        for (const roomId of userRooms) {
          const room = await this.communicationRepoService.getRoomById(roomId);
          if (!room) continue;

          const otherUserId =
            room.senderId.toString() === payload.id
              ? room.receiverId.toString()
              : room.senderId.toString();

          const otherUser = await this.userRepoService.getUserById(otherUserId);
          if (otherUser?.connectionId) {
            this.server.to(otherUser.connectionId).emit('user_status_changed', {
              userId: payload.id,
              status: 'ONLINE',
            });
          }
        }

        return client.emit('connected', {
          message: 'Connected successfully',
          userId: payload.id,
          socketId: client.id,
        });
      }
    } catch {
      console.log('-----------------------------------------------------');
      return client.emit('error', {
        message: 'Token expired',
      });
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(client: AuthenticatedSocket, payload: CreateMessageDto) {
    try {
      const { productServiceId, chatContext, message, receiverId } = payload;

      // eslint-disable-next-line prefer-const
      let [isRoomExist, isServiceProductExist, isReceiverExist] =
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

      let messageId = '';
      let messageTimestamp: Date | undefined = new Date();

      console.log('==============================', isRoomExist);

      if (!isRoomExist) {
        isRoomExist =
          await this.communicationRepoService.createCommunicationRoom(
            payload,
            client.user.id,
          );

        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', isRoomExist);
        const roomIdToUse = String(isRoomExist._id);
        const savedMessage =
          await this.communicationRepoService.createCommunicationMessage(
            { ...payload, roomId: roomIdToUse },
            client.user.id,
            { deliveryStatus: 'SENT' },
          );

        const _messageId = String(savedMessage._id);
        messageId = _messageId;

        if (savedMessage.createdAt) {
          messageTimestamp = savedMessage.createdAt;
        }
      } else {
        const roomIdToUse: string = String(isRoomExist._id);
        const [createdMessage] = await Promise.all([
          this.communicationRepoService.createCommunicationMessage(
            { ...payload, roomId: roomIdToUse },
            client.user.id,
            { deliveryStatus: 'SENT' },
          ),
          this.communicationRepoService.updateCommunicationRoom(
            roomIdToUse,
            message,
          ),
        ]);

        messageId = String(createdMessage._id);
        messageTimestamp = createdMessage.createdAt;
      }

      // Notify sender about successful message creation
      client.emit('message_send_successfully', {
        roomId: String(isRoomExist._id),
        messageId,
        timestamp: messageTimestamp,
        receiverId: receiverId,
      });

      // Deliver message to receiver if online
      if (isReceiverExist?.connectionId) {
        this.server.to(isReceiverExist.connectionId).emit('receive_message', {
          messageId,
          productServiceId: productServiceId,
          senderId: client.user.id,
          receiverId: receiverId,
          senderSocketId: client.id,
          roomId: String(isRoomExist._id),
          chatContext: chatContext,
          message: message,
          timestamp: messageTimestamp,
        });

        // Set up acknowledgment with timeout
        void this.server
          .timeout(5000)
          .to(isReceiverExist.connectionId)
          .emit('message_delivered_ack', { messageId }, (err, responses) => {
            if (
              !err &&
              responses &&
              Array.isArray(responses) &&
              responses.length > 0
            ) {
              // Update delivery status to DELIVERED
              void this.communicationRepoService.updateMessageStatus(
                messageId,
                'DELIVERED',
              );

              // Notify sender about delivery
              client.emit('message_status_update', {
                messageId,
                status: 'DELIVERED',
              });
            }
          });
      }
    } catch (error: unknown) {
      client.emit('error', {
        message: 'Failed to send message',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    client: AuthenticatedSocket,
    payload: { roomId: string; isTyping: boolean },
  ) {
    try {
      const room = await this.communicationRepoService.getRoomById(
        payload.roomId,
      );
      if (!room) {
        client.emit('error', { message: 'Room not found' });
        return;
      }

      const otherUserId =
        room.senderId.toString() === client.user.id
          ? room.receiverId.toString()
          : room.senderId.toString();

      const otherUser = await this.userRepoService.getUserById(otherUserId);
      if (otherUser?.connectionId) {
        this.server.to(otherUser.connectionId).emit('user_typing', {
          roomId: payload.roomId,
          userId: client.user.id,
          isTyping: payload.isTyping,
        });
      }
    } catch (error) {
      client.emit('error', {
        message: 'Failed to send typing indicator',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  @SubscribeMessage('mark_as_read')
  async markAsRead(
    client: AuthenticatedSocket,
    payload: { messageIds: string[]; roomId: string },
  ) {
    try {
      await this.communicationRepoService.markMessagesAsRead(
        payload.messageIds,
      );

      // Notify sender about read status
      const room = await this.communicationRepoService.getRoomById(
        payload.roomId,
      );
      if (!room) return;

      const otherUserId =
        room.senderId.toString() === client.user.id
          ? room.receiverId.toString()
          : room.senderId.toString();

      const otherUser = await this.userRepoService.getUserById(otherUserId);
      if (otherUser?.connectionId) {
        this.server.to(otherUser.connectionId).emit('messages_read', {
          messageIds: payload.messageIds,
          roomId: payload.roomId,
          readBy: client.user.id,
          readAt: new Date(),
        });
      }
    } catch (error) {
      client.emit('error', {
        message: 'Failed to mark messages as read',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  @SubscribeMessage('message_delivered_ack')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMessageDeliveredAck(
    _client: AuthenticatedSocket,
    _payload: { messageId: string },
  ) {
    // This is just an acknowledgment handler - the actual processing happens in the timeout callback
    return { received: true };
  }
}
