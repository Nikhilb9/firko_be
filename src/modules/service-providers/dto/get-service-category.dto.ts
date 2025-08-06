import { ApiProperty } from '@nestjs/swagger';
import { IServiceCategory } from '../interfaces/service-providers.interface';

export class ServiceCategoryDto implements IServiceCategory {
  @ApiProperty({ description: 'Name of the category', type: String })
  name: string;

  @ApiProperty({ description: 'Name of the category', type: String })
  icon: string;
}
