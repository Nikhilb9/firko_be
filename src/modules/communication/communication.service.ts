import { BadRequestException, Injectable } from '@nestjs/common';
import { CommunicationRepositoryService } from './communication.repository.service';
import {
  ICommunicationRoomMessageResponse,
  ICommunicationRoomResponse,
  IUnreadMessageResponse,
} from './interface/communication.interface';
import { Types } from 'mongoose';

@Injectable()
export class CommunicationService {
  constructor(
    private readonly communicationRepo: CommunicationRepositoryService,
  ) {}

  async getUserCommunicationRooms(
    userId: string,
  ): Promise<ICommunicationRoomResponse[]> {
    return this.communicationRepo.getUserCommunicationRooms(userId);
  }

  async getCommunicationRoomMessages(
    roomId: string,
    userId?: string,
  ): Promise<ICommunicationRoomMessageResponse[]> {
    if (!roomId || !Types.ObjectId.isValid(roomId)) {
      throw new BadRequestException('Invalid room id');
    }
    return this.communicationRepo.getCommunicationRoomMessages(roomId, userId);
  }

  async getUnreadMessagesForUser(userId: string): Promise<IUnreadMessageResponse[]> {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    return this.communicationRepo.getUnreadMessagesForUser(userId);
  }

  async getUnreadMessageCount(roomId: string, userId: string): Promise<number> {
    if (!roomId || !Types.ObjectId.isValid(roomId)) {
      throw new BadRequestException('Invalid room id');
    }
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    return this.communicationRepo.getUnreadMessageCount(roomId, userId);
  }

  async markRoomMessagesAsRead(roomId: string, userId: string): Promise<void> {
    if (!roomId || !Types.ObjectId.isValid(roomId)) {
      throw new BadRequestException('Invalid room id');
    }
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    await this.communicationRepo.markRoomMessagesAsRead(roomId, userId);
  }

  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    if (!messageIds || messageIds.length === 0) {
      throw new BadRequestException('Message IDs are required');
    }
    await this.communicationRepo.markMessagesAsRead(messageIds);
  }
}
