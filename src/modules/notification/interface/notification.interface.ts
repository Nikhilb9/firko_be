import { NotificationType } from '../enum/notification.enum';

export interface Notification {
  id: string;
  userId: string;
  isRead: boolean;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, any>;
  icon: string;
}

export interface GetNotificationListQuery {
  page?: number;
  limit?: number;
}
