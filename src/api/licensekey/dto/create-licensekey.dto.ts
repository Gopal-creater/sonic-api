import { ApiProperty } from '@nestjs/swagger';
import { LKOwner, LKReserve } from '../schemas/licensekey.schema';

export class CreateLicensekeyDto {
  
    @ApiProperty()
    name: string;
  
    @ApiProperty({default:false})
    disabled?: boolean;
  
    @ApiProperty({default:false})
    suspended?: boolean;
  
    @ApiProperty()
    maxEncodeUses: number;
  
    @ApiProperty()
    encodeUses: number;
  
    @ApiProperty()
    maxDecodeUses: number;
  
    @ApiProperty()
    decodeUses: number;

    @ApiProperty()
    maxMonitoringUses: number;
  
    @ApiProperty()
    monitoringUses: number;
  
    @ApiProperty()
    validity: Date;
  
    @ApiProperty()
    metaData?: Map<string, any>;

    @ApiProperty()
    owners?:LKOwner[]
}

export class AdminUpdateLicensekeyDto extends CreateLicensekeyDto {
    @ApiProperty()
    owners?:LKOwner[]
  
    @ApiProperty()
    reserves?:LKReserve[]
}