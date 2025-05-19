import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, IsNotEmpty } from 'class-validator';
import { IRatingResponse } from '../interface/rating.interface';

export class RatingResponseDto implements IRatingResponse {
  @ApiProperty({ example: 5 })
  @IsNumber()
  rating: number;

  @ApiProperty({ example: 'Great service!' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg' })
  @IsString()
  @IsUrl()
  profileImage: string;
}
