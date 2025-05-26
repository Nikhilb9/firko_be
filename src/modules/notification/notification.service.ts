import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationRepositoryService } from './notification.repository.service';
import { Notification } from './schema/notification.schema';
import { NotificationResponseDto } from './dto/get-notification-list-response.dto';
import { Types } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepoService: NotificationRepositoryService,
  ) {}

  async getUserNotifications(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<NotificationResponseDto[]> {
    const notifications: Notification[] =
      await this.notificationRepoService.getUserNotifications(
        userId,
        page,
        limit,
      );

    return notifications.map((value: Notification) => {
      return {
        id: value?._id?.toString() ?? '',
        userId: value.userId.toString(),
        isRead: value.isRead,
        type: value.type,
        title: value.title,
        body: value.body,
        data: value.data,
        icon: value.icon,
        createdAt: value?.createdAt ?? new Date(),
      };
    });
  }
  async readUserNotification(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    if (!notificationId || !Types.ObjectId.isValid(notificationId)) {
      throw new BadRequestException('Invalid notification id');
    }
    const isExist: Notification | null =
      await this.notificationRepoService.getNotificationById(
        notificationId,
        userId,
      );

    if (!isExist) {
      throw new BadRequestException('Notification not exist');
    }

    await this.notificationRepoService.readUserNotification(notificationId);
  }
}
