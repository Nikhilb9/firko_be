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
    const _userId = new Types.ObjectId(userId);

    const communicationRoomData = await this.communicationRoom
      .find({
        $or: [{ receiverId: _userId }, { senderId: _userId }],
      })
      .sort({ updatedAt: 1 })
      .populate('senderId', 'firstName lastName')
      .populate('receiverId', 'firstName lastName')
      .populate('serviceProductId', 'images')
      .exec();

    return communicationRoomData.map((room) => {
      const sender = room.senderId as unknown as {
        firstName: string;
        lastName: string;
      };
      const receiver = room.receiverId as unknown as {
        firstName: string;
        lastName: string;
      };
      const serviceProduct = room.serviceProductId as unknown as {
        _id: Types.ObjectId;
        images: string[];
      };

      return {
        id: room?._id?.toString(),
        serviceProductId: {
          id: serviceProduct?._id?.toString() ?? '',
          images: serviceProduct?.images || [],
        },
        chatContext: room.chatContext,
        latestMessage: room.latestMessage,
        senderName: sender ? `${sender.firstName} ${sender.lastName}` : '',
        receiverName: receiver
          ? `${receiver.firstName} ${receiver.lastName}`
          : '',
        updatedAt: room.updatedAt,
      };
    }) as ICommunicationRoomResponse[];
  }

  async getCommunicationRoomMessages(
    roomId: string,
  ): Promise<ICommunicationRoomMessageResponse[]> {
    const messages: CommunicationMessage[] = await this.communicationMessage
      .find({ roomId: new Types.ObjectId(roomId) })
      .select(
        'contentType message createdAt updatedAt readAt _id senderId receiverId',
      )
      .sort({ createdAt: 1 })
      .lean();

    return messages.map((msg) => ({
      id: msg._id,
      contentType: msg.contentType,
      message: msg.message,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      readAt: msg.readAt,
      senderId: msg.senderId.toString(),
      receiverId: msg.receiverId.toString(),
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
  ): Promise<void> {
    await this.communicationMessage.create({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(data.receiverId),
      roomId: new Types.ObjectId(data.roomId),
      message: data.message,
      contentType: 'TEXT',
    });
  }
}
