import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, IsEmail } from 'class-validator';
import { COGNITO_PASSWORD_REGULAR_EXPRESSION } from '../../../constants';

export class RegisterDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(COGNITO_PASSWORD_REGULAR_EXPRESSION, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class WpmsUserRegisterDTO {

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(COGNITO_PASSWORD_REGULAR_EXPRESSION, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
