import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { GetNotificationListQuery } from '../interface/notification.interface';

export class GetNotificationListQueryDto implements GetNotificationListQuery {
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
