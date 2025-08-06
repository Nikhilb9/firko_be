import { Injectable } from '@nestjs/common';
import { CommunicationRoom } from './schema/communication-room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommunicationMessage } from './schema/communication-message.schema';
import {
  ICommunicationRoomMessageResponse,
  ICommunicationRoomResponse,
  IUnreadMessageResponse,
} from './interface/communication.interface';
import { ICreateMessage } from './interface/chat.interface';

@Injectable()
export class CommunicationRepositoryService {
  constructor(
    @InjectModel(CommunicationRoom.name)
    private readonly communicationRoom: Model<CommunicationRoom>,
    @InjectModel(CommunicationMessage.name)
    private readonly communicationMessage: Model<CommunicationMessage>,
  ) {}

  async getUserCommunicationRooms(
    userId: string,
  ): Promise<ICommunicationRoomResponse[]> {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return [];
    }

    const _userId = new Types.ObjectId(userId);

    const communicationRoomData = await this.communicationRoom
      .find({
        $or: [{ receiverId: _userId }, { senderId: _userId }],
      })
      .sort({ updatedAt: -1 })
      .populate('senderId', 'firstName lastName _id')
      .populate('receiverId', 'firstName lastName _id')
      .populate('serviceId', 'images title')
      .exec();

    const roomsWithUnreadCounts = await Promise.all(
      communicationRoomData
        .filter((room) => room && room._id)
        .map(async (room) => {
          const sender = room.senderId as unknown as {
            firstName: string;
            lastName: string;
            _id: Types.ObjectId;
          } | null;
          const receiver = room.receiverId as unknown as {
            firstName: string;
            lastName: string;
            _id: Types.ObjectId;
          } | null;
          const service = room.serviceId as unknown as {
            _id: Types.ObjectId;
            images: string[];
            title: string;
          } | null;

          // Get unread count for this room
          const unreadCount = await this.getUnreadMessageCount(
            (room._id as Types.ObjectId).toString(),
            userId,
          );

          // Get last message details
          const lastMessage = await this.getLastMessage(
            (room._id as Types.ObjectId).toString(),
          );

          return {
            id: String(room?._id),
            serviceId: {
              id: service?._id?.toString() ?? '',
              images: service?.images || [],
              title: service?.title ?? '',
            },
            latestMessage: room.latestMessage,
            senderName: sender ? `${sender.firstName} ${sender.lastName}` : '',
            receiverName: receiver
              ? `${receiver.firstName} ${receiver.lastName}`
              : '',
            senderId: sender?._id?.toString() ?? '',
            receiverId: receiver?._id?.toString() ?? '',
            updatedAt: room.updatedAt,
            unreadCount,
            lastMessageDetails: lastMessage
              ? {
                  id: (lastMessage._id as Types.ObjectId).toString(),
                  senderId: lastMessage.senderId.toString(),
                  message: lastMessage.message,
                  createdAt: lastMessage.createdAt,
                  readAt: lastMessage.readAt,
                  deliveryStatus: lastMessage.deliveryStatus,
                }
              : undefined,
          };
        }),
    );

    return roomsWithUnreadCounts as ICommunicationRoomResponse[];
  }

  async getCommunicationRoomMessages(
    roomId: string,
    userId?: string,
  ): Promise<ICommunicationRoomMessageResponse[]> {
    if (!roomId || !Types.ObjectId.isValid(roomId)) {
      return [];
    }

    const messages: CommunicationMessage[] = await this.communicationMessage
      .find({ roomId: new Types.ObjectId(roomId) })
      .select(
        'contentType message createdAt updatedAt readAt _id senderId receiverId deliveryStatus attachments',
      )
      .sort({ createdAt: 1 })
      .lean();

    return messages
      .filter((msg) => msg && msg._id)
      .map((msg) => ({
        id: msg._id,
        contentType: msg.contentType,
        message: msg.message,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        readAt: msg.readAt,
        senderId: msg.senderId?.toString() ?? '',
        receiverId: msg.receiverId?.toString() ?? '',
        deliveryStatus: msg.deliveryStatus,
        attachments: msg.attachments || [],
        isUnread: !msg.readAt && msg.receiverId?.toString() === userId,
      })) as ICommunicationRoomMessageResponse[];
  }

  async getUnreadMessageCount(roomId: string, userId: string): Promise<number> {
    if (
      !roomId ||
      !Types.ObjectId.isValid(roomId) ||
      !userId ||
      !Types.ObjectId.isValid(userId)
    ) {
      return 0;
    }

    const count = await this.communicationMessage.countDocuments({
      roomId: new Types.ObjectId(roomId),
      receiverId: new Types.ObjectId(userId),
      readAt: { $exists: false },
    });

    return count;
  }

  async getUnreadMessagesForUser(
    userId: string,
  ): Promise<IUnreadMessageResponse[]> {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return [];
    }

    const _userId = new Types.ObjectId(userId);

    // Get all rooms where user is a participant
    const userRooms = await this.communicationRoom
      .find({
        $or: [{ receiverId: _userId }, { senderId: _userId }],
      })
      .select('_id')
      .lean();

    const unreadMessagesData = await Promise.all(
      userRooms.map(async (room) => {
        const unreadCount = await this.getUnreadMessageCount(
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          room._id.toString(),
          userId,
        );

        if (unreadCount === 0) {
          return null;
        }

        // Get the last unread message
        const lastUnreadMessage = await this.communicationMessage
          .findOne({
            roomId: room._id,
            receiverId: _userId,
            readAt: { $exists: false },
          })
          .sort({ createdAt: -1 })
          .select('_id message senderId createdAt')
          .lean();

        return {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          roomId: room._id.toString(),
          unreadCount,
          lastUnreadMessage: lastUnreadMessage
            ? {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                id: lastUnreadMessage._id.toString(),
                message: lastUnreadMessage.message,
                senderId: lastUnreadMessage.senderId.toString(),
                createdAt: lastUnreadMessage.createdAt,
              }
            : undefined,
        };
      }),
    );

    return unreadMessagesData.filter(
      (data) => data !== null,
    ) as IUnreadMessageResponse[];
  }

  async getLastMessage(roomId: string): Promise<CommunicationMessage | null> {
    if (!roomId || !Types.ObjectId.isValid(roomId)) {
      return null;
    }

    return this.communicationMessage
      .findOne({ roomId: new Types.ObjectId(roomId) })
      .sort({ createdAt: -1 })
      .select('_id message senderId createdAt readAt deliveryStatus')
      .lean();
  }

  async markRoomMessagesAsRead(roomId: string, userId: string): Promise<void> {
    if (
      !roomId ||
      !Types.ObjectId.isValid(roomId) ||
      !userId ||
      !Types.ObjectId.isValid(userId)
    ) {
      return;
    }

    const now = new Date();
    await this.communicationMessage.updateMany(
      {
        roomId: new Types.ObjectId(roomId),
        receiverId: new Types.ObjectId(userId),
        readAt: { $exists: false },
      },
      {
        readAt: now,
        deliveryStatus: 'READ',
      },
    );
  }

  async createCommunicationRoom(
    data: ICreateMessage,
    senderId: string,
  ): Promise<CommunicationRoom> {
    return this.communicationRoom.create({
      serviceId: new Types.ObjectId(data.serviceId),
      latestMessage: data.message,
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(data.receiverId),
    });
  }

  async createCommunicationRoomWithRetry(
    data: ICreateMessage,
    senderId: string,
  ): Promise<CommunicationRoom> {
    try {
      return await this.communicationRoom.create({
        serviceId: new Types.ObjectId(data.serviceId),
        latestMessage: data.message,
        senderId: new Types.ObjectId(senderId),
        receiverId: new Types.ObjectId(data.receiverId),
      });
    } catch (error: any) {
      // If it's a duplicate key error (code 11000), try to find the existing room
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        const existingRoom = await this.findCommunicationRoomByUsers(
          senderId,
          data.receiverId,
          data.serviceId,
        );
        if (existingRoom) {
          return existingRoom;
        }
      }
      throw error;
    }
  }

  async getCommunicationRoom(
    senderId: string,
    receiverId: string,
    serviceId: string,
  ): Promise<CommunicationRoom | null> {
    return this.communicationRoom.findOne({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      serviceId: new Types.ObjectId(serviceId),
    });
  }

  async findCommunicationRoomByUsers(
    userId1: string,
    userId2: string,
    serviceId: string,
  ): Promise<CommunicationRoom | null> {
    return this.communicationRoom.findOne({
      serviceId: new Types.ObjectId(serviceId),
      $or: [
        {
          senderId: new Types.ObjectId(userId1),
          receiverId: new Types.ObjectId(userId2),
        },
        {
          senderId: new Types.ObjectId(userId2),
          receiverId: new Types.ObjectId(userId1),
        },
      ],
    });
  }

  async getRoomById(roomId: string): Promise<CommunicationRoom | null> {
    return this.communicationRoom.findById(new Types.ObjectId(roomId));
  }

  async updateCommunicationRoom(
    roomId: string,
    message: string,
  ): Promise<void> {
    await this.communicationRoom.updateOne(
      { _id: new Types.ObjectId(roomId) },
      {
        latestMessage: message,
      },
    );
  }

  async createCommunicationMessage(
    data: ICreateMessage,
    senderId: string,
    options: { deliveryStatus?: string } = {},
  ): Promise<CommunicationMessage> {
    return this.communicationMessage.create({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(data.receiverId),
      roomId: new Types.ObjectId(data.roomId),
      message: data.message,
      contentType: 'TEXT',
      deliveryStatus: options.deliveryStatus || 'SENT',
      clientTempId: data.clientTempId,
    });
  }

  async updateMessageStatus(messageId: string, status: string): Promise<void> {
    await this.communicationMessage.updateOne(
      { _id: new Types.ObjectId(messageId) },
      { deliveryStatus: status },
    );
  }

  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    const now = new Date();
    await this.communicationMessage.updateMany(
      { _id: { $in: messageIds.map((id) => new Types.ObjectId(id)) } },
      {
        readAt: now,
        deliveryStatus: 'READ',
      },
    );
  }

  async getUserRoomIds(userId: string): Promise<string[]> {
    const _userId = new Types.ObjectId(userId);
    const rooms = await this.communicationRoom
      .find({
        $or: [{ receiverId: _userId }, { senderId: _userId }],
      })
      .select('_id')
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return rooms.map((room) => room._id.toString());
  }

  async findMessageByClientTempId(
    clientTempId: string,
    senderId: string,
  ): Promise<CommunicationMessage | null> {
    return this.communicationMessage.findOne({
      clientTempId: clientTempId,
      senderId: new Types.ObjectId(senderId),
    });
  }
}
