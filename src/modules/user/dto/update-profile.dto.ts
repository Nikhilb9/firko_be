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
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IUserProfile } from '../interfaces/user.interface';
import { INDIAN_LANGUAGES } from '../user.constants';

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
export class UpdateProfileDto implements IUserProfile {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

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

  @ApiProperty({ enum: Gender, required: true })
  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender: Gender;

  @ApiProperty({ required: true, minimum: 0, maximum: 120 })
  @IsNotEmpty({ message: 'Age is required' })
  @IsNumber()
  @Min(0, { message: 'Age must be at least 0' })
  @Max(120, { message: 'Age must be at most 120' })
  age: number;
}
