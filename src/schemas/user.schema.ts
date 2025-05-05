import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: false, trim: true, lowercase: true })
  email?: string;

  @Prop({ required: true })
  password: string; // Should be hashed before saving

  @Prop({ required: true, max: 13 })
  phone: string;

  @Prop({ required: false })
  profilePicture?: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
