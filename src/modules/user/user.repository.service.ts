import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IRegister } from '../../modules/auth/interface/auth.interface';
import { User } from './schemas/user.schema';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  findOneByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  createUser(user: IRegister): Promise<User> {
    return this.userModel.create(user);
  }

  getUserById(id: string): Promise<User | null> {
    const objectId = new Types.ObjectId(id);
    return this.userModel.findById(objectId).exec();
  }

  async updateUser(
    id: string,
    updateData: Record<string, any>,
  ): Promise<User | null> {
    const objectId = new Types.ObjectId(id);
    await this.userModel.updateOne({ _id: objectId }, updateData);
    return this.getUserById(id);
  }

  async updateOtp(id: string, otp: string, expiresAt: Date): Promise<void> {
    const objectId = new Types.ObjectId(id);
    await this.userModel.updateOne(
      { _id: objectId },
      { otp, otpExpiresAt: expiresAt },
    );
  }

  async updateUserConnectionId(
    connectionId: string | null,
    userId: string,
  ): Promise<void> {
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(userId) },
      { connectionId: connectionId },
    );
  }
}
