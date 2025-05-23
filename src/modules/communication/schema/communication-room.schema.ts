import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ServiceProduct } from 'src/modules/service-providers/schema/service-providers.schema';
import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class CommunicationRoom extends Document {
  @Prop({ type: Types.ObjectId, ref: ServiceProduct.name, required: true })
  serviceProductId: Types.ObjectId;

  @Prop({ enum: ['SERVICE', 'PRODUCT'], required: true })
  chatContext: 'SERVICE' | 'PRODUCT';

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
