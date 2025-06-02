import { Types } from 'mongoose';
import { FeedbackType } from '../enum';

export interface ICreateFeedback {
  serviceId?: Types.ObjectId;
  rating: number;
  message?: string;
  type: FeedbackType;
}

export interface IFeedback extends ICreateFeedback {
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
