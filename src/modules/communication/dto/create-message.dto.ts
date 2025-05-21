import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { ServiceProductType } from 'src/modules/service-providers/enums/service-providers.enum';
import { ICreateMessage } from '../interface/chat.interface';

export class CreateMessageDto implements ICreateMessage {
  @ApiProperty({ description: 'Product service id', required: true })
  @IsMongoId()
  @IsNotEmpty()
  productServiceId: ObjectId;

  @ApiProperty({ description: 'Receiver id', required: true })
  @IsMongoId()
  @IsNotEmpty()
  receiverId: ObjectId;

  @ApiProperty({ description: 'Room id', required: false })
  @IsMongoId()
  @IsOptional()
  roomId?: ObjectId;

  @ApiProperty({
    enum: [ServiceProductType.PRODUCT, ServiceProductType.SERVICE],
    type: String,
    description: 'Chat context',
    required: true,
  })
  @IsString()
  @IsEnum(ServiceProductType)
  chatContext: ServiceProductType;

  @ApiProperty({ description: 'Message', required: true })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Receiver socket id', required: true })
  @IsString()
  @IsNotEmpty()
  receiverSocketId: string;
}
