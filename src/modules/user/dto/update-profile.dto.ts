import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsUrl,
  IsIn,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IUserProfile } from '../interfaces/user.interface';
import { INDIAN_LANGUAGES } from '../user.constants';

export class UpdateProfileDto implements IUserProfile {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ description: 'User location address' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'User latitude' })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ description: 'User longitude' })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  profileImage?: string;

  @ApiPropertyOptional({
    enum: INDIAN_LANGUAGES,
    isArray: true,
    description: 'Array of supported Indian languages',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(INDIAN_LANGUAGES, {
    each: true,
    message: 'Each language must be a valid Indian language',
  })
  languages?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Phone number is not valid' })
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  experience?: number;

  @ApiPropertyOptional({ description: 'Push notfication toke' })
  @IsString()
  @IsOptional()
  deviceToken: string;
}
