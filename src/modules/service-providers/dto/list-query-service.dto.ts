import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IServiceListQuery } from '../interfaces/service-providers.interface';

export class ServiceListQueryDto implements IServiceListQuery {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Latitude',
  })
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  latitude: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Longitude',
  })
  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  longitude: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Search query',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Page number (starting from 1)',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Category query',
  })
  @IsString()
  @IsOptional()
  category: string;
}
