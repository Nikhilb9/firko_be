import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  ValidateIf,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ILogin } from '../interface/auth.interface';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'EmailOrPhone', async: false })
export class EmailOrPhoneConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const { email, phone } = args.object as ILogin;
    return (!!email && !phone) || (!!phone && !email);
  }

  defaultMessage() {
    return 'Provide either email or phone, but not both';
  }
}

export class LoginDto implements ILogin {
  @ApiProperty()
  @ValidateIf((o: ILogin) => !o.phone)
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @ValidateIf((o: ILogin) => !o.email)
  @IsPhoneNumber(undefined)
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @Validate(EmailOrPhoneConstraint)
  private readonly _onlyOneContact!: unknown;
}
