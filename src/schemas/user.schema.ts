import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: false, trim: true, lowercase: true })
  email?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, max: 13 })
  phone: string;

  @Prop({ required: false })
  profileImage?: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: false, trim: true })
  location: string;

  @Prop({ required: false, trim: true })
  latitude: number;

  @Prop({ required: false, trim: true })
  longitude: number;

  @Prop({ required: false })
  languages: [string];

  @Prop({ required: false, default: 0 })
  experience: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
