import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { IServiceProductListResponse } from '../interfaces/service-providers.interface';
import { ServiceProductType } from '../enums/service-providers.enum';

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
    type: [String],
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
}
