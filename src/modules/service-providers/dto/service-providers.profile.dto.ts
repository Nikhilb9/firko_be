import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
import { Expose } from 'class-transformer';
import { IServiceProvidersProfile } from '../interfaces/service-providers.interface';

export class ServiceProvidersProfileDto implements IServiceProvidersProfile {
  @ApiProperty({
    example: '60f6a8c2e4b0b5c7e4c9b1f0',
    description: 'User ID',
  })
  @IsString()
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({
    example: 'John',
    description: "User's first name",
  })
  @IsString()
  @Expose()
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: "User's last name",
  })
  @IsString()
  @Expose()
  last_name: string;

  @ApiProperty({
    example: 'https://example.com/images/profile.jpg',
    description: 'Profile picture URL',
    required: false,
  })
  @IsUrl()
  @Expose()
  profileImage: string;

  @ApiProperty({
    description: 'Is user email verified',
  })
  @Expose()
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'Is user phone verified',
  })
  @Expose()
  isPhoneVerified: boolean;
}
