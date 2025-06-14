import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FAQ extends Document {
  @Prop({ required: true, type: String })
  question: string;

  @Prop({ required: true, type: String })
  answer: string;

  @Prop({ required: true, type: String })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const FAQSchema = SchemaFactory.createForClass(FAQ);
