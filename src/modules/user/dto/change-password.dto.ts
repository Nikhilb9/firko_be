import { IsString, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUpdatePassword } from '../interfaces/user.interface';

export class UpdatePasswordDto implements IUpdatePassword {
  @ApiProperty({ description: 'Current password of the user' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: 'New password that meets strong criteria' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password is not strong enough' },
  )
  newPassword: string;
}
