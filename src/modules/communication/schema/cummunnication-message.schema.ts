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

  @Prop({ enum: ['TEXT', 'LOCATION'], required: true })
  contentType: 'TEXT' | 'LOCATION';

  @Prop({ type: Types.ObjectId, ref: CommunicationRoom.name, required: true })
  roomId: Types.ObjectId;

  @Prop({ type: Date })
  readAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CommunicationMessageSchema =
  SchemaFactory.createForClass(CommunicationMessage);
