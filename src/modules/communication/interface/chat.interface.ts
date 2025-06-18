import { ServiceProductType } from '../../service-providers/enums/service-providers.enum';
import { Socket } from 'socket.io';
import { IAuthData } from '../../auth/interface/auth.interface';

export interface ICreateMessage {
  productServiceId: string;
  receiverId: string;
  roomId?: string;
  chatContext: ServiceProductType;
  message: string;
  receiverSocketId: string;
}

export interface AuthenticatedSocket extends Socket {
  user: IAuthData;
}
