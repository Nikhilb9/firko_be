import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ICreateMessage } from '../interface/chat.interface';

export class CreateMessageDto implements ICreateMessage {
  @ApiProperty({ description: 'Service id', required: true })
  @IsMongoId()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ description: 'Receiver id', required: true })
  @IsMongoId()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({ description: 'Message', required: true })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Receiver socket id', required: false })
  @IsString()
  @IsOptional()
  receiverSocketId?: string;

  @ApiProperty({ description: 'Room id', required: false })
  @IsMongoId()
  @IsOptional()
  roomId?: string;

  @ApiProperty({ description: 'Client temporary ID for deduplication', required: false })
  @IsString()
  @IsOptional()
  clientTempId?: string;
}
