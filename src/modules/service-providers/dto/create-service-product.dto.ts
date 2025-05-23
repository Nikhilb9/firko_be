import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  ValidateIf,
  ArrayNotEmpty,
  IsNotEmpty,
  IsPositive,
  Max,
  IsUrl,
  IsOptional,
  MaxLength,
} from 'class-validator';
import {
  AllowedUserStatuses,
  ServiceProductType,
  Weekday,
} from '../enums/service-providers.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICreateServiceProduct } from '../interfaces/service-providers.interface';

export class CreateServiceProductDto implements ICreateServiceProduct {
  @ApiProperty({
    description: 'Location of the service and product',
    maxLength: 400,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  location: string;

  @ApiProperty({
    description: 'Longitude for service or product',
  })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    description: 'Latitude for service or product',
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Price of the product or starting price of the service',
  })
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Title of the service or product',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Description of the service or product',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Images of the service or product',
    type: [String],
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
    description: 'Category of the service or product',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @ApiProperty({
    description: 'Type of the service or product',
    enum: ServiceProductType,
  })
  @IsEnum(ServiceProductType)
  @IsNotEmpty()
  type: ServiceProductType;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.type === ServiceProductType.SERVICE)
  @ApiProperty({
    description: 'Skills required for the service (only for services)',
    type: [String],
    example: ['Plumbing', 'Electrician'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  skills?: string[];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.type === ServiceProductType.SERVICE)
  @ApiProperty({
    description: 'Available days of the service (only for services)',
    enum: Weekday,
    type: [String],
    required: false,
  })
  @IsArray()
  @IsEnum(Weekday, { each: true })
  @ArrayNotEmpty()
  @IsOptional()
  availableDays?: Weekday[];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.type === ServiceProductType.SERVICE)
  @ApiProperty({
    description: 'Working hours of the service (only for services)',
    required: false,
  })
  @IsString()
  @IsOptional()
  workingHours?: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.type === ServiceProductType.SERVICE)
  @ApiProperty({
    description: 'Service area km of the service (only for services)',
    required: false,
  })
  @IsNumber()
  @Max(1000)
  @IsPositive()
  serviceAreaKM?: number;

  @ApiPropertyOptional({
    description: 'Status of the service or product',
    enum: AllowedUserStatuses,
    required: false,
  })
  @IsEnum(AllowedUserStatuses)
  @IsString()
  @IsOptional()
  status?: AllowedUserStatuses;
}
