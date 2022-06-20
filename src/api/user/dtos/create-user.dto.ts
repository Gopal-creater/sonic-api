import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Validate,Matches } from 'class-validator';
import { MFAOption } from '../schemas/user.db.schema';
import {
  UserExists,
  UserExistsRule,
} from '../validations/userexists.validation';
import { SystemRoles } from 'src/constants/Enums';
import { COGNITO_PASSWORD_REGULAR_EXPRESSION } from '../../../constants/index';
import { Type, Transform } from 'class-transformer';
import { Types } from "mongoose"
import { BadRequestException } from '@nestjs/common';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

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

function toMongoObjectId({ value, key }): Types.ObjectId {
  if ( Types.ObjectId.isValid(value) && ( new Types.ObjectId(value).toString() === value)) {
      return new Types.ObjectId(value);
  } else {
      throw new BadRequestException(`${key} is not a valid MongoId`);
  }
}

export class ValidationTestDto {
  @ApiProperty()
  // @UserExists()
  @Validate(UserExistsRule)
  user: string;

  @ApiProperty()
  param1: string;
}
