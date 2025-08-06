import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDate,
} from 'class-validator';
import { IServiceListResponse } from '../interfaces/service-providers.interface';
import { ServiceStatus } from '../enums/service-providers.enum';

export class ServiceListResponseDto implements IServiceListResponse {
  @ApiProperty({ description: 'ID of the service' })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Location of the service',
    maxLength: 400,
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Starting price of the service',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Title of the service',
    maxLength: 200,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Images of the service',
    type: String,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    description: 'Indicates whether the service is verified',
    default: false,
  })
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({
    description: 'Service status',
    enum: ServiceStatus,
  })
  status: ServiceStatus;

  @ApiProperty({
    description: 'Date when the service or product was created',
    type: Date,
  })
  @IsDate()
  createdAt: Date;
}
