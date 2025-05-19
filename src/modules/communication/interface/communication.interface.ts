import { ServiceProductType } from '../../service-providers/enums/service-providers.enum';

interface ServiceProductSummary {
  id: string;
  images: string[];
}

export interface CommunicationRoomResponse {
  id: string;
  serviceProductId: ServiceProductSummary;
  chatContext: ServiceProductType;
  latestMessage: string;
  senderName: string;
  receiverName: string;
  updatedAt: Date;
}
