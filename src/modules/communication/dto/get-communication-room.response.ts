import { ApiProperty } from '@nestjs/swagger';
import {
  ICommunicationRoomResponse,
  IServiceSummary,
} from '../interface/communication.interface';

export class ServiceSummaryDto implements IServiceSummary {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: String, isArray: true })
  images: string[];

  @ApiProperty({ type: String })
  title: string;
}

export class CommunicationRoomResponseDto
  implements ICommunicationRoomResponse
{
  @ApiProperty()
  id: string;

  @ApiProperty({ type: ServiceSummaryDto })
  serviceId: ServiceSummaryDto;

  @ApiProperty()
  latestMessage: string;

  @ApiProperty()
  unreadCount: number;

  @ApiProperty()
  senderName: string;

  @ApiProperty()
  receiverName: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  updatedAt: Date;
}
