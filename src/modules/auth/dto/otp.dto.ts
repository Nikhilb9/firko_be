import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';
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
}
