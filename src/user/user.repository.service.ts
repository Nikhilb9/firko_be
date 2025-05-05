import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRegister } from 'src/auth/interface/auth.interface';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserRepositoryService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  findOneByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  createUser(user: IRegister): Promise<User> {
    return this.userModel.create(user);
  }
}
