import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ServiceStatus, Weekday } from '../enums/service-providers.enum';
import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class Service extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: String })
  location: string;

  @Prop({ required: true, type: Number })
  longitude: number;

  @Prop({ required: true, type: Number })
  latitude: number;

  @Prop({ required: true, min: 0, type: Number })
  price: number;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length > 0 && val.length <= 50],
  })
  images: string[];

  @Prop({ required: true, type: String })
  category: string;

  @Prop({
    type: [String],
  })
  skills?: string[];

  @Prop({
    type: [String],
    enum: Weekday,
  })
  availableDays?: Weekday[];

  @Prop({ type: String })
  workingHours?: string;

  @Prop({ min: 1, type: Number })
  serviceAreaKM?: number;

  @Prop({ default: false, type: Boolean })
  isVerified: boolean;

  @Prop({ default: false, type: Boolean })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;

  // Add geoLocation field for geospatial queries
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  })
  geoLocation: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({
    enum: ServiceStatus,
    default: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

ServiceSchema.index({ geoLocation: '2dsphere' });
