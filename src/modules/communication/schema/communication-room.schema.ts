import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ServiceProduct } from '../../../modules/service-providers/schema/service-providers.schema';
import { User } from '../../user/schemas/user.schema';
import { ServiceProductType } from '../../../modules/service-providers/enums/service-providers.enum';

@Schema({ timestamps: true })
export class CommunicationRoom extends Document {
  @Prop({ type: Types.ObjectId, ref: ServiceProduct.name, required: true })
  serviceProductId: Types.ObjectId;

  @Prop({ enum: ServiceProductType, required: true })
  chatContext: ServiceProductType;

  @Prop({ type: String, default: '' })
  latestMessage: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  receiverId: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CommunicationRoomSchema =
  SchemaFactory.createForClass(CommunicationRoom);

// Add compound unique index to prevent duplicate rooms
// This ensures only one room exists per unique combination of users and service product
CommunicationRoomSchema.index(
  { 
    serviceProductId: 1,
    senderId: 1,
    receiverId: 1
  },
  { unique: true }
);
