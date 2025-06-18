import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { ServiceProduct } from '../../../modules/service-providers/schema/service-providers.schema';

@Schema({ timestamps: true })
export class Rating extends Document {
  @Prop({ type: Types.ObjectId, ref: ServiceProduct.name, required: true })
  serviceId: string;

  @Prop({ required: true, min: 1, type: Number })
  rating: number;

  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
