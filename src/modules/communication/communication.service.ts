import { BadRequestException, Injectable } from '@nestjs/common';
import { CommunicationRepositoryService } from './communication.repository.service';
import {
  ICommunicationRoomMessageResponse,
  ICommunicationRoomResponse,
} from './interface/communication.interface';
import { Types } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { ServiceProductType } from '../service-providers/enums/service-providers.enum';

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

  validateSendMessagePayload(payload: CreateMessageDto): string | null {
    const { productServiceId, receiverId, message, chatContext } = payload;

    if (
      !productServiceId ||
      !receiverId ||
      !message ||
      !chatContext ||
      !Types.ObjectId.isValid(productServiceId) ||
      !Types.ObjectId.isValid(receiverId) ||
      !Object.values(ServiceProductType).includes(chatContext)
    ) {
      return 'Invalid payload. productServiceId, receiverId, message, and chatContext are required.';
    }

    return null;
  }
}
