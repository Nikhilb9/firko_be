import { ObjectId } from 'mongoose';
import { ServiceProductType } from '../../service-providers/enums/service-providers.enum';
import { Socket } from 'socket.io';
import { IAuthData } from '../../auth/interface/auth.interface';

export interface ICreateMessage {
  productServiceId: ObjectId;
  receiverId: ObjectId;
  roomId?: ObjectId;
  chatContext: ServiceProductType;
  message: string;
  receiverSocketId: string;
}

export interface AuthenticatedSocket extends Socket {
  user: IAuthData;
}
