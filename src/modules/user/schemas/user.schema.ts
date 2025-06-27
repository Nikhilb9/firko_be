import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
    type: String,
  })
  email?: string;

  @Prop({ maxlength: 13, unique: true, sparse: true })
  phone?: string;

  @Prop({ type: String })
  profileImage?: string;

  @Prop({ type: String })
  address?: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isPhoneVerified: boolean;

  @Prop({ required: true, trim: true, type: String })
  firstName: string;

  @Prop({ required: false, trim: true, type: String })
  lastName: string;

  @Prop({ type: String, enum: ['male', 'female', 'other'] })
  gender?: string;

  @Prop({ type: Number, min: 0, max: 120 })
  age?: number;

  @Prop({ type: Boolean, default: false })
  isOnboarded: boolean;

  @Prop({ type: String, trim: true })
  location: string;

  @Prop({ type: Number, trim: true })
  latitude: number;

  @Prop({ type: Number, trim: true })
  longitude: number;

  @Prop({ type: [String] })
  languages: string[];

  @Prop({ type: Number, default: 0 })
  experience: number;

  @Prop({ type: String })
  connectionId: string;

  @Prop({ type: String })
  deviceToken: string;

  // OTP related fields
  @Prop({ type: String })
  otp: string;

  @Prop({ type: Date })
  otpExpiresAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create TTL index for OTP expiration
UserSchema.index(
  { otpExpiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { otpExpiresAt: { $exists: true } },
  },
);
