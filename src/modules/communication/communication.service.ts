import { Injectable } from '@nestjs/common';
import { CommunicationRepositoryService } from './communication.repository.service';

@Injectable()
export class CommunicationService {
  constructor(
    private readonly communicationRepo: CommunicationRepositoryService,
  ) {}
  async getUserCommunicationRooms(userId: string): Promise<void> {
    const communicationRoom =
      await this.communicationRepo.getUserCommunicationRooms(userId);
  }
  async getCommunicationRoomMessages(roomId: string): Promise<void> {
    const communicationRoomMessages =
      await this.communicationRepo.getCommunicationRoomMessages(roomId);
  }
}
