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
}
