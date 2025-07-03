import { ServiceProductType } from '../../service-providers/enums/service-providers.enum';
import { Socket } from 'socket.io';
import { IAuthData } from '../../auth/interface/auth.interface';

export interface ICreateMessage {
  productServiceId: string;
  receiverId: string;
  roomId?: string;
  chatContext: ServiceProductType;
  message: string;
  receiverSocketId?: string;
  clientTempId?: string;
}

export interface AuthenticatedSocket extends Socket {
  user: IAuthData;
}

export interface TypingPayload {
  roomId?: string;
  isTyping: boolean;
  receiverId?: string;
  productServiceId?: string;
}
