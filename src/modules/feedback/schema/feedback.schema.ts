import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Service } from '../../service-providers/schema/service-providers.schema';
import { FeedbackType } from '../enum';

@Schema({ timestamps: true })
export class Feedback extends Document {
  @Prop({ type: Types.ObjectId, ref: Service.name, required: false })
  serviceId?: string;

  @Prop({ required: true, min: 1, max: 5, type: Number })
  rating: number;

  @Prop({ type: String, required: false })
  message?: string;

  @Prop({ type: String, enum: FeedbackType, required: true })
  type: FeedbackType;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
