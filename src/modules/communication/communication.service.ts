import { Injectable } from '@nestjs/common';
import { CommunicationRepositoryService } from './communication.repository.service';
import {
  ICommunicationRoomMessageResponse,
  ICommunicationRoomResponse,
} from './interface/communication.interface';

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
    return this.communicationRepo.getCommunicationRoomMessages(roomId);
  }
}
