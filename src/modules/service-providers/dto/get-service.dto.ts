import { ApiProperty } from '@nestjs/swagger';
import { Weekday, ServiceStatus } from '../enums/service-providers.enum';
import { IServiceResponse } from '../interfaces/service-providers.interface';
import { ServiceProvidersProfileDto } from './service-providers.profile.dto';
import { Type } from 'class-transformer';

export class ServiceResponseDto implements IServiceResponse {
  @ApiProperty({
    description: 'ID of the service',
  })
  id: string;

  @ApiProperty({
    description: 'Location of the service',
    maxLength: 400,
  })
  location: string;

  @ApiProperty({
    description: 'Longitude for service',
  })
  longitude: number;

  @ApiProperty({
    description: 'Latitude for service',
  })
  latitude: number;

  @ApiProperty({
    description: 'Starting price of the service',
  })
  price: number;

  @ApiProperty({
    description: 'Title of the service',
    maxLength: 200,
  })
  title: string;

  @ApiProperty({
    description: 'Description of the service',
    maxLength: 1000,
  })
  description: string;

  @ApiProperty({
    description: 'Images of the service',
    type: String,
    isArray: true,
  })
  images: string[];

  @ApiProperty({
    description: 'Category of the service',
  })
  category: string;

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
    description: 'Indicates whether the service is verified',
    default: false,
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'Status of the service',
    enum: ServiceStatus,
    example: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;

  @ApiProperty({
    description: 'Created date of the service (ISO format)',
  })
  createdAt: Date;

  @ApiProperty({ description: 'User detail hwo upload service' })
  @Type(() => ServiceProvidersProfileDto)
  user: ServiceProvidersProfileDto;
}
