import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  ArrayNotEmpty,
  IsNotEmpty,
  IsPositive,
  IsUrl,
  IsOptional,
  MaxLength,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import {
  AllowedUserStatuses,
  ServiceStatus,
  Weekday,
} from '../enums/service-providers.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICreateService } from '../interfaces/service-providers.interface';

export class CreateServiceDto implements ICreateService {
  @ApiProperty({
    description: 'Location of the service',
    maxLength: 400,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  location: string;

  @ApiProperty({
    description: 'Longitude for service',
  })
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    description: 'Latitude for service',
  })
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    description: 'Starting price of the service',
  })
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Title of the service',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Description of the service',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Images of the service',
    type: String,
    isArray: true,
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  images: string[];

  @ApiProperty({
    description: 'Category of the service',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @ApiProperty({
    description: 'Skills required for the service (only for services)',
    type: String,
    isArray: true,
    example: ['Plumbing', 'Electrician'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  skills: string[];

  @ApiProperty({
    description: 'Available days of the service (only for services)',
    enum: Weekday,
    type: String,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsEnum(Weekday, { each: true })
  @ArrayNotEmpty()
  @IsOptional()
  availableDays: Weekday[];

  @ApiProperty({
    description: 'Working hours of the service (only for services)',
    required: false,
  })
  @IsString()
  @IsOptional()
  workingHours: string;

  @ApiProperty({
    description: 'Service area km of the service (only for services)',
    required: false,
  })
  @IsNumber()
  @IsPositive()
  serviceAreaKM: number;

  @ApiPropertyOptional({
    description: 'Status of the service',
    enum: { ...AllowedUserStatuses, ACTIVE: ServiceStatus.ACTIVE },
    required: false,
  })
  @IsEnum({ ...AllowedUserStatuses, ACTIVE: ServiceStatus.ACTIVE })
  @IsString()
  @IsOptional()
  status: AllowedUserStatuses | ServiceStatus.ACTIVE;
}
