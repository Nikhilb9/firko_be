import { ApiProperty } from '@nestjs/swagger';
import { ICommunicationRoomMessageResponse } from '../interface/communication.interface';

export class CommunicationRoomMessageResponseDto
  implements ICommunicationRoomMessageResponse
{
  @ApiProperty()
  id: string;

  @ApiProperty()
  contentType: 'TEXT' | 'LOCATION';

  @ApiProperty()
  message: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  readAt: Date;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  deliveryStatus: string;

  @ApiProperty()
  attachments: string[];
}
