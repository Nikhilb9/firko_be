import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ServiceProductType, Weekday } from '../enums/service-providers.enum';
import { User } from 'src/schemas/user.schema';

@Schema({ timestamps: true })
export class ServiceProduct extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, maxlength: 400 })
  location: string;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, maxlength: 200 })
  title: string;

  @Prop({ required: true, maxlength: 1000 })
  description: string;

  @Prop({
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length > 0 && val.length <= 50],
  })
  images: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ServiceProductType })
  type: ServiceProductType;

  @Prop({
    type: [String],
    required: false,
    validate: [(val: string[]) => val == null || val.length > 0],
  })
  skills?: string[];

  @Prop({
    type: [String],
    enum: Weekday,
    required: false,
    validate: [(val: string[]) => val == null || val.length > 0],
  })
  availableDays?: Weekday[];

  @Prop()
  workingHours?: string;

  @Prop({ min: 1, required: false })
  serviceAreaKM?: number;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
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
      index: '2dsphere',
    },
  })
  geoLocation: {
    type: 'Point';
    coordinates: [number, number];
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const ServiceProductSchema =
  SchemaFactory.createForClass(ServiceProduct);

ServiceProductSchema.index({ geoLocation: '2dsphere' });

// Add pre-save hook to set geoLocation.coordinates from longitude and latitude
ServiceProductSchema.pre<ServiceProduct>('save', function (next) {
  if (this.longitude != null && this.latitude != null) {
    this.geoLocation = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude],
    };
  }
  next();
});
