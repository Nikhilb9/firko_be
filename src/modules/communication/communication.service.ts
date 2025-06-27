import { BadRequestException, Injectable } from '@nestjs/common';
import { CommunicationRepositoryService } from './communication.repository.service';
import {
  ICommunicationRoomMessageResponse,
  ICommunicationRoomResponse,
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
  ): Promise<ICommunicationRoomMessageResponse[]> {
    if (!roomId || !Types.ObjectId.isValid(roomId)) {
      throw new BadRequestException('Invalid room id');
    }
    return this.communicationRepo.getCommunicationRoomMessages(roomId);
  }
}
