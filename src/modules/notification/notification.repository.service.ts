import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schema/notification.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class NotificationRepositoryService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  getUserNotifications(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<Notification[]> {
    const _page = page ?? 1;
    const _limit = limit ?? 10;

    const skip = (_page - 1) * _limit;

    return this.notificationModel
      .find({ userId: new Types.ObjectId(userId), isRead: false })
      .skip(skip)
      .limit(_limit)
      .sort({ createdAt: -1 });
  }

  async readUserNotification(notificationId: string): Promise<void> {
    await this.notificationModel.updateOne(
      { _id: new Types.ObjectId(notificationId) },
      { isRead: true },
    );
  }

  getNotificationById(
    notificationId: string,
    userId: string,
  ): Promise<Notification | null> {
    return this.notificationModel.findOne({
      _id: new Types.ObjectId(notificationId),
      userId: new Types.ObjectId(userId),
    });
  }
}
