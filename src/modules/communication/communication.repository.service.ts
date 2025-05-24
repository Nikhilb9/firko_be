import { Injectable } from '@nestjs/common';
import { CommunicationRoom } from './schema/communication-room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommunicationMessage } from './schema/cummunnication-message.schema';
import {
  ICommunicationRoomMessageResponse,
  ICommunicationRoomResponse,
} from './interface/communication.interface';

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
          id: serviceProduct?._id?.toString() || '',
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

  async createCommunicationMessage() {}
  async createCommunicationRoom() {}
  async updateCommunicationRoom() {}
}
