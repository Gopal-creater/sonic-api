import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { MFAOption } from '../schemas/user.db.schema';
import {
  UserExists,
  UserExistsRule,
} from '../validations/userexists.validation';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  isPhoneNumberVerified: boolean;

  @ApiProperty()
  userRole?: string;

  @ApiProperty()
  company?: string;

  @ApiProperty()
  partner?: string;

  @ApiProperty()
  sendInvitationByEmail: boolean;
}

export class ValidationTestDto {
  @ApiProperty()
  // @UserExists()
  @Validate(UserExistsRule)
  user: string;

  @ApiProperty()
  param1: string;
}
