import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IAuthData } from '../interface/auth.interface';

export class AuthDataDto implements IAuthData {
  @ApiProperty({
    description: 'Authentication token',
    example: 'jwt_token_here',
  })
  token: string;

  @ApiProperty({
    description: 'User phone number',
    example: '1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User address',
    example: '123 Main St, City, Country',
  })
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'User id' })
  id: string;
}
