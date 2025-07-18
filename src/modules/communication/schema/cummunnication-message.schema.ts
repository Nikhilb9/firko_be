import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { CommunicationRoom } from './communication-room.schema';

@Schema({ timestamps: true })
export class CommunicationMessage extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  receiverId: Types.ObjectId;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ enum: ['TEXT', 'LOCATION'], required: true, default: 'TEXT' })
  contentType: 'TEXT' | 'LOCATION';

  @Prop({ type: Types.ObjectId, ref: CommunicationRoom.name, required: true })
  roomId: Types.ObjectId;

  @Prop({ type: Date })
  readAt?: Date;

  @Prop({ enum: ['SENT', 'DELIVERED', 'READ'], default: 'SENT' })
  deliveryStatus: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ type: String, required: false, index: true })
  clientTempId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CommunicationMessageSchema =
  SchemaFactory.createForClass(CommunicationMessage);
