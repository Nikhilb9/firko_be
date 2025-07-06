import { ApiProperty } from '@nestjs/swagger';
import {
  ICommunicationRoomResponse,
  IServiceProductSummary,
} from '../interface/communication.interface';
import { ServiceProductType } from '../../../modules/service-providers/enums/service-providers.enum';

export class ServiceProductSummaryDto implements IServiceProductSummary {
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

  @ApiProperty({ type: ServiceProductSummaryDto })
  serviceProductId: ServiceProductSummaryDto;

  @ApiProperty({ enum: ServiceProductType })
  chatContext: ServiceProductType;

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
