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
import {
  ProductOrServiceStatus,
  ServiceProductType,
} from '../../../modules/service-providers/enums/service-providers.enum';

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
    const userId: string | null = await this.verifyToken(client);

    if (!userId) {
      return client.emit('error', { message: 'Token expired' });
    }

    this.connectedUsers.delete(userId);
    await this.userRepoService.updateUserConnectionId(null, userId);
    await this.notifyUsersAboutStatus(userId, 'OFFLINE');

    return client.emit('disconnected', {
      message: 'Disconnected successfully',
      userId: userId,
      socketId: client.id,
    });
  }

  async handleConnection(client: AuthenticatedSocket) {
    const userId: string | null = await this.verifyToken(client);

    if (!userId) {
      return client.emit('error', { message: 'Token expired' });
    }

    this.connectedUsers.set(userId, client.id);
    await this.userRepoService.updateUserConnectionId(client.id, userId);
    await this.notifyUsersAboutStatus(userId, 'ONLINE');

    return client.emit('connected', {
      message: 'Connected successfully',
      userId: userId,
      socketId: client.id,
    });
  }

  @SubscribeMessage('send_message')
  async handleMessage(client: AuthenticatedSocket, payload: CreateMessageDto) {
    try {
      const {
        productServiceId,
        chatContext,
        message,
        receiverId,
        clientTempId,
      } = payload;

      const validationError = this.validatePayload(payload);

      if (validationError) {
        return client.emit('error', { message: validationError });
      }

      // CRITICAL FIX: Check if sender and receiver are the same user
      if (client.user.id.toString() === receiverId.toString()) {
        client.emit('error', {
          message: 'Sender and receiver cannot be the same user',
        });
        return;
      }

      // CRITICAL: Add deduplication check using clientTempId
      if (clientTempId) {
        const existingMessage =
          await this.communicationRepoService.findMessageByClientTempId(
            clientTempId,
            client.user.id,
          );

        if (
          existingMessage &&
          existingMessage.roomId &&
          existingMessage._id &&
          existingMessage.createdAt
        ) {
          // Message already processed, just send confirmation
          const roomId = String(existingMessage.roomId);
          const messageId = String(existingMessage._id);
          const timestamp = existingMessage.createdAt;

          client.emit('message_send_successfully', {
            roomId,
            messageId,
            timestamp,
            senderId: client.user.id,
            receiverId: receiverId,
            clientTempId: clientTempId,
          });
          return;
        }
      }

      // Check if service product and receiver exist
      const [isServiceProductExist, isReceiverExist] = await Promise.all([
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

      // Find existing room between the two users for this service product
      const existingRoom =
        await this.communicationRepoService.findCommunicationRoomByUsers(
          client.user.id,
          receiverId,
          productServiceId,
        );

      // Use the existing room or create a new one
      let roomIdToUse: string;

      if (!existingRoom) {
        // Create new room with retry logic for duplicate key handling
        const newRoom =
          await this.communicationRepoService.createCommunicationRoomWithRetry(
            payload,
            client.user.id,
          );
        if (!newRoom || !newRoom._id) {
          throw new Error('Failed to create communication room');
        }
        roomIdToUse = String(newRoom._id);
      } else {
        // Use existing room
        if (!existingRoom._id) {
          throw new Error('Existing room has no valid ID');
        }
        roomIdToUse = String(existingRoom._id);
      }

      // Create the message
      const savedMessage =
        await this.communicationRepoService.createCommunicationMessage(
          { ...payload, roomId: roomIdToUse, clientTempId },
          client.user.id,
          { deliveryStatus: 'SENT' },
        );

      if (!savedMessage || !savedMessage._id) {
        throw new Error('Failed to create communication message');
      }

      const messageId = String(savedMessage._id);
      const messageTimestamp = savedMessage.createdAt || new Date();

      // Update room with latest message
      await this.communicationRepoService.updateCommunicationRoom(
        roomIdToUse,
        message,
      );

      // Notify sender about successful message creation
      client.emit('message_send_successfully', {
        roomId: roomIdToUse,
        messageId,
        timestamp: messageTimestamp,
        senderId: client.user.id,
        receiverId: receiverId,
        clientTempId: clientTempId,
      });

      // Deliver message to receiver if online
      if (isReceiverExist?.connectionId) {
        this.server.to(isReceiverExist.connectionId).emit('receive_message', {
          messageId,
          productServiceId: productServiceId,
          senderId: client.user.id,
          receiverId: receiverId,
          senderSocketId: client.id,
          roomId: roomIdToUse,
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      client.emit('error', {
        message: 'Failed to send message',
        details: errorMessage,
      });
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    client: AuthenticatedSocket,
    payload: { roomId: string; isTyping: boolean },
  ) {
    try {
      if (!payload.roomId || !Types.ObjectId.isValid(payload.roomId)) {
        return client.emit('error', {
          message: 'Invalid room ID',
        });
      }
      const room = await this.communicationRepoService.getRoomById(
        payload.roomId,
      );
      if (!room) {
        return client.emit('error', { message: 'Room not found' });
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
  handleMessageDeliveredAck() {
    // This is just an acknowledgment handler - the actual processing happens in the timeout callback
    return { received: true };
  }

  private validatePayload(payload: CreateMessageDto): string | null {
    const { productServiceId, receiverId, message, chatContext } = payload;

    if (
      !productServiceId ||
      !receiverId ||
      !message ||
      !chatContext ||
      !Types.ObjectId.isValid(productServiceId) ||
      !Types.ObjectId.isValid(receiverId) ||
      !Object.values(ServiceProductType).includes(chatContext)
    ) {
      return 'Invalid payload. productServiceId, receiverId, message, and chatContext are required.';
    }

    return null;
  }

  async verifyToken(client: AuthenticatedSocket): Promise<string | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload: { id: string; phone: string } =
        await this.jwtService.verify(client?.handshake?.query?.token as string);

      if (payload?.id && Types.ObjectId.isValid(payload.id)) {
        return payload.id;
      }
      return null;
    } catch {
      return null;
    }
  }

  async notifyUsersAboutStatus(userId: string, status: 'ONLINE' | 'OFFLINE') {
    const userRooms =
      await this.communicationRepoService.getUserRoomIds(userId);

    const notifyPromises = userRooms.map(async (roomId) => {
      const room = await this.communicationRepoService.getRoomById(roomId);
      if (!room) return;

      const otherUserId =
        room.senderId.toString() === userId
          ? room.receiverId.toString()
          : room.senderId.toString();

      const otherUser = await this.userRepoService.getUserById(otherUserId);
      if (otherUser?.connectionId) {
        this.server.to(otherUser.connectionId).emit('user_status_changed', {
          userId,
          status,
        });
      }
    });

    // Wait for all notifications to complete in parallel
    await Promise.all(notifyPromises);
  }
}
