import { ServiceProductType } from '../../service-providers/enums/service-providers.enum';

export interface IServiceProductSummary {
  id: string;
  images: string[];
}

export interface ICommunicationRoomResponse {
  id: string;
  serviceProductId: {
    id: string;
    images: string[];
    title: string;
  };
  chatContext: ServiceProductType;
  latestMessage: string;
  senderName: string;
  receiverName: string;
  senderId: string;
  receiverId: string;
  updatedAt: Date;
  unreadCount: number;
  lastMessageDetails?: {
    id: string;
    senderId: string;
    message: string;
    createdAt: Date;
    readAt?: Date;
    deliveryStatus: string;
  };
}

export interface ICommunicationRoomMessageResponse {
  id: string;
  contentType: 'TEXT' | 'LOCATION';
  message: string;
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  senderId: string;
  receiverId: string;
  deliveryStatus: string;
  attachments: string[];
  isUnread: boolean;
}

export interface IUnreadMessageResponse {
  roomId: string;
  unreadCount: number;
  lastUnreadMessage?: {
    id: string;
    message: string;
    senderId: string;
    createdAt: Date;
  };
}
