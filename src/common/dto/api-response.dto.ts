// src/common/dto/api-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({
    description: 'HTTP status code of the response',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Sub-code for more detailed status',
    example: 'SUCCESS',
  })
  subCode: string;

  @ApiProperty({
    description: 'Description or message regarding the response',
    example: 'Request successful',
  })
  message: string;

  @ApiProperty({
    description: 'Optional data returned by the API',
    required: false,
    example: { userId: 1, username: 'john_doe' },
  })
  data?: T;

  constructor(statusCode: number, subCode: string, message: string, data?: T) {
    this.statusCode = statusCode;
    this.subCode = subCode;
    this.message = message;
    this.data = data;
  }
}
