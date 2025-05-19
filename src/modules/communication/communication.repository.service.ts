import { Injectable } from '@nestjs/common';
import { CommunicationRoom } from './schema/communication-room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommunicationMessage } from './schema/cummunnication-message.schema';
import { CommunicationRoomResponse } from './interface/communication.interface';

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
  ): Promise<CommunicationRoomResponse[]> {
    const _userId = new Types.ObjectId(userId);
    const communicationRoomData = await this.communicationRoom
      .find({
        $or: [{ receiverId: _userId }, { senderId: _userId }],
      })
      .sort({ updatedAt: 1 })
      .populate('senderId', 'firstName lastName') // populate only firstName, lastName
      .populate('receiverId', 'firstName lastName')
      .populate('serviceProductId', 'images')
      .exec();

    return communicationRoomData.map((data) => ({
      id: data?._id?.toString(),
      //   serviceProductId: {
      //     id: data.serviceProductId?._id.toString() ?? '',
      //     images: data.serviceProductId?.images ?? [],
      //   },
      //   chatContext: data.chatContext,
      //   latestMessage: data.latestMessage,
      //   senderName: data.senderId
      //     ? `${(data.senderId as any).firstName} ${(data.senderId as any).lastName}`
      //     : '',
      //   receiverName: data.receiverId
      //     ? `${(data.receiverId as any).firstName} ${(data.receiverId as any).lastName}`
      //     : '',
      //   updatedAt: data.updatedAt,
    })) as CommunicationRoomResponse[];
  }
  async getCommunicationRoomMessages(
    roomId: string,
  ): Promise<CommunicationMessage[]> {
    return this.communicationMessage
      .find({
        roomId: new Types.ObjectId(roomId),
      })
      .sort({ createdAt: 1 });
  }
}
