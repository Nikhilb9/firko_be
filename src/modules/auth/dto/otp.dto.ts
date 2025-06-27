import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(4, 6, { message: 'OTP must be between 4 and 6 characters' })
  otp: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(40)
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(40)
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;
}
