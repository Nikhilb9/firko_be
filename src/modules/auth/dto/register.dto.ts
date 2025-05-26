import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ILogin, IRegister } from '../interface/auth.interface';
import { ApiProperty } from '@nestjs/swagger';
@ValidatorConstraint({ name: 'EmailOrPhone', async: false })
export class EmailOrPhoneConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const { email, phone } = args.object as IRegister;
    return (!!email && !phone) || (!!phone && !email);
  }

  defaultMessage() {
    return 'Provide either email or phone, but not both';
  }
}
export class RegisterDto implements IRegister {
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

  @ApiProperty()
  @ValidateIf((o: ILogin) => !o.phone)
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @ValidateIf((o: ILogin) => !o.email)
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @Validate(EmailOrPhoneConstraint)
  private readonly _onlyOneContact!: unknown;
}
