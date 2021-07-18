import { ApiProperty } from '@nestjs/swagger';

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
    validity: Date;
  
    @ApiProperty()
    metaData?: Map<string, any>;
}