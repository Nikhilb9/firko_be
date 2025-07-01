import { ApiProperty } from '@nestjs/swagger';
import { ServiceProductType, Weekday, ProductOrServiceStatus } from '../enums/service-providers.enum';
import { IServiceProductResponse } from '../interfaces/service-providers.interface';
import { ServiceProvidersProfileDto } from './service-providers.profile.dto';
import { Type } from 'class-transformer';

export class ServiceProductResponseDto implements IServiceProductResponse {
  @ApiProperty({
    description: 'ID of the service/product',
  })
  id: string;

  @ApiProperty({
    description: 'Location of the service and product',
    maxLength: 400,
  })
  location: string;

  @ApiProperty({
    description: 'Longitude for service or product',
  })
  longitude: number;

  @ApiProperty({
    description: 'Latitude for service or product',
  })
  latitude: number;

  @ApiProperty({
    description: 'Price of the product or starting price of the service',
  })
  price: number;

  @ApiProperty({
    description: 'Title of the service or product',
    maxLength: 200,
  })
  title: string;

  @ApiProperty({
    description: 'Description of the service or product',
    maxLength: 1000,
  })
  description: string;

  @ApiProperty({
    description: 'Images of the service or product',
    type: String,
    isArray: true,
  })
  images: string[];

  @ApiProperty({
    description: 'Category of the service or product',
  })
  category: string;

  @ApiProperty({
    description: 'Type of the service or product',
    enum: ServiceProductType,
  })
  type: ServiceProductType;

  @ApiProperty({
    description: 'Skills required for the service (only for services)',
    type: String,
    isArray: true,
    required: false,
  })
  skills?: string[];

  @ApiProperty({
    description: 'Available days of the service (only for services)',
    enum: Weekday,
    type: String,
    isArray: true,
    required: false,
  })
  availableDays?: Weekday[];

  @ApiProperty({
    description: 'Working hours of the service (only for services)',
    required: false,
  })
  workingHours?: string;

  @ApiProperty({
    description: 'Service area km of the service (only for services)',
    required: false,
  })
  serviceAreaKM?: number;

  @ApiProperty({
    description: 'Indicates whether the service or product is verified',
    default: false,
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'Status of the service or product',
    enum: ProductOrServiceStatus,
    example: ProductOrServiceStatus.ACTIVE,
  })
  status: ProductOrServiceStatus;

  @ApiProperty({
    description: 'Created date of the service or product (ISO format)',
  })
  createdAt: Date;

  @ApiProperty({ description: 'User detail hwo upload service or product' })
  @Type(() => ServiceProvidersProfileDto)
  user: ServiceProvidersProfileDto;
}
