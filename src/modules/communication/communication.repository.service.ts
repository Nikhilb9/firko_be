import { Injectable } from '@nestjs/common';
import { CommunicationRoom } from './schema/communication-room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommunicationMessage } from './schema/cummunnication-message.schema';
import {
  ICommunicationRoomMessageResponse,
  ICommunicationRoomResponse,
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
      .sort({ updatedAt: 1 })
      .populate('senderId', 'firstName lastName _id')
      .populate('receiverId', 'firstName lastName _id')
      .populate('serviceProductId', 'images title')
      .exec();

    return communicationRoomData
      .filter((room) => room && room._id) // Filter out any null rooms
      .map((room) => {
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
        const serviceProduct = room.serviceProductId as unknown as {
          _id: Types.ObjectId;
          images: string[];
          title: string;
        } | null;

        return {
          id: String(room?._id),
          serviceProductId: {
            id: serviceProduct?._id?.toString() ?? '',
            images: serviceProduct?.images || [],
            title: serviceProduct?.title ?? '',
          },
          chatContext: room.chatContext,
          latestMessage: room.latestMessage,
          senderName: sender ? `${sender.firstName} ${sender.lastName}` : '',
          receiverName: receiver
            ? `${receiver.firstName} ${receiver.lastName}`
            : '',
          senderId: sender?._id?.toString() ?? '',
          receiverId: receiver?._id?.toString() ?? '',
          updatedAt: room.updatedAt,
        };
      }) as ICommunicationRoomResponse[];
  }

  async getCommunicationRoomMessages(
    roomId: string,
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
      .filter((msg) => msg && msg._id) // Filter out any null messages
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
      })) as ICommunicationRoomMessageResponse[];
  }

  async createCommunicationRoom(
    data: ICreateMessage,
    senderId: string,
  ): Promise<CommunicationRoom> {
    return this.communicationRoom.create({
      serviceProductId: new Types.ObjectId(data.productServiceId),
      chatContext: data.chatContext,
      latestMessage: data.message,
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(data.receiverId),
    });
  }

  async getCommunicationRoom(
    senderId: string,
    receiverId: string,
    productServiceId: string,
  ): Promise<CommunicationRoom | null> {
    return this.communicationRoom.findOne({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      serviceProductId: new Types.ObjectId(productServiceId),
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
