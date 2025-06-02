import {
  IsMongoId,
  IsInt,
  Min,
  Max,
  IsString,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { FeedbackType } from '../enum';

export class CreateFeedbackDto {
  @ApiPropertyOptional({
    description: 'Service to provide feedback for',
    example: '64e3d3f7f4a6c1d9e6ab8b19',
    type: Types.ObjectId,
  })
  @IsMongoId()
  @IsOptional()
  serviceId?: Types.ObjectId;

  @ApiProperty({
    description: 'Rating value between 1 and 5',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional message with the feedback',
    maxLength: 1000,
    example: 'Great service, but could improve response time',
  })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: 'Type of feedback',
    enum: FeedbackType,
    example: FeedbackType.GENERAL,
  })
  @IsEnum(FeedbackType)
  type: FeedbackType;
}
