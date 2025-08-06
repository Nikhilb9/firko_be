import { Socket } from 'socket.io';
import { IAuthData } from '../../auth/interface/auth.interface';

export interface ICreateMessage {
  serviceId: string;
  receiverId: string;
  roomId?: string;
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
  serviceId?: string;
}
