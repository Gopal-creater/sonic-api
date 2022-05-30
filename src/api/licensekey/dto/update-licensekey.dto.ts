import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateLicensekeyDto } from './create-licensekey.dto';

export class UpdateLicensekeyDto extends PartialType(
  OmitType(CreateLicensekeyDto, ['type', 'company', 'user']),
) {}

export class AddUserToLicense {
  @ApiProperty()
  @IsNotEmpty()
  user: string;
}
