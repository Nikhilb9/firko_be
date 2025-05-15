import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IRegister } from '../interface/auth.interface';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto implements IRegister {
  @ApiProperty()
  @IsPhoneNumber(undefined, { message: 'Phone number is not valid' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @MaxLength(40)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @MaxLength(40)
  lastName: string;
}
