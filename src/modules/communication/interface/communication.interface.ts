import { ServiceProductType } from '../../service-providers/enums/service-providers.enum';

export interface IServiceProductSummary {
  id: string;
  images: string[];
}

export interface ICommunicationRoomResponse {
  id: string;
  serviceProductId: IServiceProductSummary;
  chatContext: ServiceProductType;
  latestMessage: string;
  senderName: string;
  receiverName: string;
  updatedAt: Date;
}

export interface ICommunicationRoomMessageResponse {
  id: string;
  contentType: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  readAt: Date;
  senderId: string;
  receiverId: string;
}
