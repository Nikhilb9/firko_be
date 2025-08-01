import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, IsDate } from 'class-validator';
import { IServiceProductListResponse } from '../interfaces/service-providers.interface';
import {
  ProductOrServiceStatus,
  ServiceProductType,
} from '../enums/service-providers.enum';

export class ServiceProductListResponseDto
  implements IServiceProductListResponse
{
  @ApiProperty({ description: 'ID of the service/product' })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Location of the service and product',
    maxLength: 400,
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Price of the product or starting price of the service',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Title of the service or product',
    maxLength: 200,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Images of the service or product',
    type: String,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    description: 'Indicates whether the service or product is verified',
    default: false,
  })
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({
    description: 'Is this a service or product',
    default: false,
  })
  type: ServiceProductType;

  @ApiProperty({
    description: 'Product or service status',
    enum: ProductOrServiceStatus,
  })
  status: ProductOrServiceStatus;

  @ApiProperty({
    description: 'Date when the service or product was created',
    type: Date,
  })
  @IsDate()
  createdAt: Date;
}
