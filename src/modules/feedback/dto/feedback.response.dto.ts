import { ApiProperty } from '@nestjs/swagger';
import { FeedbackType } from '../enum';
import { IsMongoId } from 'class-validator';

export class FeedbackResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  serviceId?: string;

  @ApiProperty({ example: 4 })
  rating: number;

  @ApiProperty({ example: 'Great service!' })
  message?: string;

  @ApiProperty({ enum: FeedbackType, example: FeedbackType.GENERAL })
  type: FeedbackType;

  @ApiProperty({ description: 'User Id' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
