import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class OnboardUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @MaxLength(40)
  firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @MaxLength(40)
  lastName: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;
}
