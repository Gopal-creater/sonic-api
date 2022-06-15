import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { LKOwner, LKReserve } from '../schemas/licensekey.schema';

export class CreateLicensekeyDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ default: false })
  disabled?: boolean;

  @ApiProperty({ default: false })
  suspended?: boolean;

  @ApiProperty()
  maxEncodeUses: number;

  @ApiProperty({ default: false })
  isUnlimitedEncode: boolean;

  @ApiProperty()
  encodeUses: number;

  @ApiProperty({ default: false })
  isUnlimitedDecode: boolean;

  @ApiProperty()
  maxDecodeUses: number;

  @ApiProperty()
  decodeUses: number;

  @ApiProperty()
  maxMonitoringUses: number;

  @ApiProperty({ default: false })
  isUnlimitedMonitor: boolean;

  @ApiProperty()
  monitoringUses: number;

  @ApiProperty()
  validity: Date;

  @ApiProperty()
  metaData?: Map<string, any>;

  @ApiProperty()
  user?: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedBy: string;
}

export class AdminUpdateLicensekeyDto extends PartialType(
  OmitType(CreateLicensekeyDto, ['company','type']),
) {

  @ApiProperty()
  users?: string[];

  @ApiProperty()
  reserves?: LKReserve[];
}
