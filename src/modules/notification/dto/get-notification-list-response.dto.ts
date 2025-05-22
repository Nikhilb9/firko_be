import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../enum/notification.enum';

export class NotificationResponseDto {
  @ApiProperty({ example: 'abc123', description: 'Id of the notification' })
  id: string;

  @ApiProperty({ example: 'user123' })
  userId: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.CHAT_MESSAGE,
  })
  type: NotificationType;

  @ApiProperty({ example: 'New Message' })
  title: string;

  @ApiProperty({ example: 'You have a new chat message.' })
  body: string;

  @ApiProperty({
    example: { chatId: 'xyz789', sender: 'user456' },
    type: Object,
  })
  data: Record<string, any>;

  @ApiProperty({
    type: String,
    description: 'Icon of the notification',
  })
  icon: string;
}
