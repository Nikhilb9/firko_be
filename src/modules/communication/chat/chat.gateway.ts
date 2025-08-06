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
import {
  AuthenticatedSocket,
  TypingPayload,
} from '../interface/chat.interface';
import { CommunicationRepositoryService } from '../communication.repository.service';
import { JwtService } from '../../../common/services/jwt.service';
import { Types } from 'mongoose';
import { ServiceRepositoryService } from '../../../modules/service-providers/service-providers.repository.service';
import { ServiceStatus } from '../../../modules/service-providers/enums/service-providers.enum';
import { CommunicationRoom } from '../schema/communication-room.schema';
import { CommunicationMessage } from '../schema/cummunication-message.schema';

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
    private readonly serviceProvidersRepositoryService: ServiceRepositoryService,
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
      const { serviceId, message, receiverId, clientTempId } = payload;

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
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
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

      // Check if service receiver exist
      const [isServiceExist, isReceiverExist] = await Promise.all([
        this.serviceProvidersRepositoryService.getServiceById(serviceId),
        this.userRepoService.getUserById(receiverId),
      ]);

      if (!isServiceExist || isServiceExist.status !== ServiceStatus.ACTIVE) {
        client.emit('error', {
          message: 'Service does not exist or is not active',
        });
        return;
      }

      if (!isReceiverExist) {
        client.emit('error', {
          message: 'Receiver does not exist',
        });
        return;
      }

      // Find existing room between the two users for this service
      const existingRoom =
        await this.communicationRepoService.findCommunicationRoomByUsers(
          client.user.id,
          receiverId,
          serviceId,
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
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        roomIdToUse = newRoom._id.toString();
      } else {
        // Use existing room
        if (!existingRoom._id) {
          throw new Error('Existing room has no valid ID');
        }
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        roomIdToUse = existingRoom._id.toString();
      }

      // Create the message
      const savedMessage: CommunicationMessage =
        await this.communicationRepoService.createCommunicationMessage(
          { ...payload, roomId: roomIdToUse, clientTempId },
          client.user.id,
          { deliveryStatus: 'SENT' },
        );

      if (!savedMessage || !savedMessage._id) {
        throw new Error('Failed to create communication message');
      }

      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const messageId = savedMessage._id.toString();
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
          serviceId: serviceId,
          senderId: client.user.id,
          receiverId: receiverId,
          senderSocketId: client.id,
          roomId: roomIdToUse,
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
  async handleTyping(client: AuthenticatedSocket, payload: TypingPayload) {
    try {
      let room: CommunicationRoom | null = null;
      let otherUserId: string | null = null;

      // If roomId is provided, try to find the room
      if (payload.roomId && Types.ObjectId.isValid(payload.roomId)) {
        room = await this.communicationRepoService.getRoomById(payload.roomId);

        if (room) {
          otherUserId =
            room.senderId.toString() === client.user.id
              ? room.receiverId.toString()
              : room.senderId.toString();
        }
      }

      // If no room found but we have receiverId and serviceId, try to find existing room
      if (!room && payload.receiverId && payload.serviceId) {
        room = await this.communicationRepoService.findCommunicationRoomByUsers(
          client.user.id,
          payload.receiverId,
          payload.serviceId,
        );

        if (room) {
          otherUserId =
            room.senderId.toString() === client.user.id
              ? room.receiverId.toString()
              : room.senderId.toString();
        } else {
          // No room exists yet, but we can still send typing indicator to the receiver
          otherUserId = payload.receiverId;
        }
      }

      // If we still don't have otherUserId, we can't send typing indicator
      if (!otherUserId) {
        return client.emit('error', {
          message: 'Unable to determine recipient for typing indicator',
        });
      }

      const otherUser = await this.userRepoService.getUserById(otherUserId);
      if (otherUser?.connectionId) {
        this.server.to(otherUser.connectionId).emit('user_typing', {
          roomId: room?._id?.toString() || null,
          userId: client.user.id,
          isTyping: payload.isTyping,
          receiverId: otherUserId,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          serviceId: payload.serviceId,
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
    const { serviceId, receiverId, message } = payload;

    if (
      !serviceId ||
      !receiverId ||
      !message ||
      !Types.ObjectId.isValid(serviceId) ||
      !Types.ObjectId.isValid(receiverId)
    ) {
      return 'Invalid payload. serviceId, receiverId, message, and chatContext are required.';
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
