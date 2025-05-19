import { Types } from 'mongoose';

export interface ICreateRating {
  serviceId: Types.ObjectId;
  rating: number;
  comment: string;
}

export interface IPopulatedUser {
  firstName: string;
  lastName: string;
  profileImage: string;
}

export interface IPopulatedRating {
  rating: number;
  comment: string;
  userId: IPopulatedUser;
}

export interface IRatingResponse {
  rating: number;
  comment: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}
