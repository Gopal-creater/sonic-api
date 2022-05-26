import { ApiProperty, OmitType } from '@nestjs/swagger';
import { RegisterDTO } from '../../auth/dto/register.dto';
import { IsNotEmpty } from 'class-validator';
export class AddNewLicenseDto {
  @ApiProperty()
  licenseKey: string;
}

export class AddUserToGroupDto {
  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  group: string;
}

export class RemoveUserFromGroupDto {
  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  group: string;
}

export class AddUserToCompanyDto {
  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  company: string;
}

export class MakeAdminCompanyDto {
  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  company: string;
}

export class RemoveUserFromCompanyDto {
  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  company: string;
}

export class AddBulkNewLicensesDto {
  @ApiProperty()
  licenseKeys: [string];
}

export class UpdateProfileDto {
  @ApiProperty()
  attributes: [{ Name: string; Value: any }];
}

export class ChangePassword {
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class CognitoCreateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  isPhoneNumberVerified: boolean;

  @ApiProperty()
  group?: string;

  @ApiProperty()
  company?: string;

  @ApiProperty()
  sendInvitationByEmail: boolean;
}

export class CompanyFindOrCreateUser extends OmitType(CognitoCreateUserDTO,['company','group']){}

export class CreateUserInCognitoDto extends OmitType(CognitoCreateUserDTO,['company','group']){}
