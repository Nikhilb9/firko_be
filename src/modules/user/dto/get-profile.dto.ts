import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IUserProfile } from '../interfaces/user.interface';
import { INDIAN_LANGUAGES } from '../user.constants';

export class GetProfileResponseDto implements IUserProfile {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  latitude?: number;

  @ApiProperty()
  longitude?: number;

  @ApiPropertyOptional()
  profileImage?: string;

  @ApiPropertyOptional({
    enum: INDIAN_LANGUAGES,
    isArray: true,
    description: 'Array of supported Indian languages',
  })
  languages?: string[];

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  experience?: number;

  @ApiProperty({
    description: 'Is phone verified',
    type: Boolean,
  })
  isPhoneVerified?: boolean;

  @ApiProperty({
    description: 'Is email verified',
    type: Boolean,
  })
  isEmailVerified?: boolean;

  @ApiPropertyOptional({
    enum: ['male', 'female', 'other'],
    description: 'User gender',
  })
  gender?: string;

  @ApiPropertyOptional({
    description: 'User age',
    type: Number,
    minimum: 0,
    maximum: 120,
  })
  age?: number;

  @ApiProperty({
    description: 'Is user onboarded',
    type: Boolean,
  })
  isOnboarded?: boolean;

  @ApiPropertyOptional()
  deviceToken?: string;
}
