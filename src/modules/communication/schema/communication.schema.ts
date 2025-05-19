import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Communication extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ type: String })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'ServiceProduct', required: true })
  serviceProductId: Types.ObjectId;

  @Prop({ enum: ['SERVICE', 'PRODUCT'], required: true })
  chatContext: 'SERVICE' | 'PRODUCT';

  @Prop({ enum: ['TEXT', 'LOCATION'], required: true })
  contentType: 'TEXT' | 'LOCATION';

  @Prop({ type: Date })
  readAt?: Date;
}

export const CommunicationSchema = SchemaFactory.createForClass(Communication);
CommunicationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 }); // 2 days TTL
