import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { MFAOption } from '../schemas/user.db.schema';
import { UserExists,UserExistsRule } from '../validations/userexists.validation';

export class CreateUserDto {
  constructor(data: CreateUserDto) {
    Object.assign(this, data);
  }
  @IsNotEmpty()
  @ApiProperty()
  _id: string;

  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  sub: string;

  @ApiProperty()
  email_verified?: boolean;

  @ApiProperty()
  phone_number_verified?: boolean;

  @ApiProperty()
  phone_number?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  user_status?: string;

  @ApiProperty()
  enabled?: boolean;

  @ApiProperty()
  mfa_options?: any[];
}

export class ValidationTestDto{

  @ApiProperty()
  // @UserExists()
  @Validate(UserExistsRule)
  user:string

  @ApiProperty()
  param1: string
}
