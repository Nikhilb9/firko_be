import {
  IsMongoId,
  IsInt,
  Min,
  Max,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICreateRating } from '../interface/rating.interface';
import { Types } from 'mongoose';

export class CreateRatingDto implements ICreateRating {
  @ApiProperty({
    description: 'Service to be rated',
    example: '64e3d3f7f4a6c1d9e6ab8b19',
    type: Types.ObjectId,
  })
  @IsMongoId()
  serviceId: Types.ObjectId;

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

  @ApiProperty({
    description: 'Comment about the service or product',
    maxLength: 500,
    example: 'Excellent service!',
  })
  @IsString()
  @MaxLength(500)
  comment: string;
}
