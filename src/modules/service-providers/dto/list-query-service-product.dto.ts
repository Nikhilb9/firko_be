import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ServiceProductType } from '../enums/service-providers.enum';
import { Transform } from 'class-transformer';
import { IServiceProductListQuery } from '../interfaces/service-providers.interface';

export class ServiceProductListQueryDto implements IServiceProductListQuery {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Latitude',
  })
  @IsString()
  latitude?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Longitude',
  })
  @IsString()
  longitude?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Search query',
  })
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ServiceProductType,
    description: 'Search type (SERVICE or PRODUCT)',
  })
  @IsOptional()
  @IsEnum(ServiceProductType)
  type?: ServiceProductType;

  @ApiPropertyOptional({
    type: Number,
    description: 'Page number (starting from 1)',
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
