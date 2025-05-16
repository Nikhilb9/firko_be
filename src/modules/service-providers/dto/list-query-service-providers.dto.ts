import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { ServiceProductType } from '../enums/service-providers.enum';
import { Transform } from 'class-transformer';

export class ServiceProductListQueryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'User ID (MongoDB ObjectId) to filter for a specific user',
  })
  @IsOptional()
  @IsMongoId({ message: 'forUser must be a valid MongoDB ObjectId' })
  forUser?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Latitude - required if forUser is not provided',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.forUser !== true)
  @IsString()
  latitude?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Longitude - required if forUser is not provided',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.forUser !== true)
  @IsString()
  longitude?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Search query - required if forUser is not provided',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.forUser !== true)
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ServiceProductType,
    description: 'Search type (SERVICE or PRODUCT)',
  })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.forUser !== true)
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
