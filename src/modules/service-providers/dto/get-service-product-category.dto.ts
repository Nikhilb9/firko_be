import { ApiProperty } from '@nestjs/swagger';
import { ServiceProductType } from '../enums/service-providers.enum';
import { IServiceProductCategory } from '../interfaces/service-providers.interface';

export class ServiceProductCategoryDto implements IServiceProductCategory {
  @ApiProperty({ description: 'Name of the category', type: String })
  name: string;

  @ApiProperty({
    description: 'Type of the category',
    enum: [ServiceProductType.PRODUCT, ServiceProductType.SERVICE],
    type: String,
  })
  type: ServiceProductType;

  @ApiProperty({ description: 'Name of the category', type: String })
  icon: string;
}
