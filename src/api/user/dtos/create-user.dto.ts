import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Validate,Matches } from 'class-validator';
import { MFAOption } from '../schemas/user.db.schema';
import {
  UserExists,
  UserExistsRule,
} from '../validations/userexists.validation';
import { SystemRoles } from 'src/constants/Enums';
import { COGNITO_PASSWORD_REGULAR_EXPRESSION } from '../../../constants/index';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  name?: string;

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
  email: string;

  @ApiProperty()
  isEmailVerified?: boolean;

  @ApiProperty()
  isPhoneNumberVerified?: boolean;

  @ApiProperty()
  @IsEnum(SystemRoles)
  userRole?: SystemRoles;

  @ApiProperty()
  company?: string;

  @ApiProperty()
  partner?: string;

  @ApiProperty()
  sendInvitationByEmail?: boolean;
}

export class ValidationTestDto {
  @ApiProperty()
  // @UserExists()
  @Validate(UserExistsRule)
  user: string;

  @ApiProperty()
  param1: string;
}
