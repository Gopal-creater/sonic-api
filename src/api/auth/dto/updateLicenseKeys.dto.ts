import { ApiProperty } from '@nestjs/swagger';

export class UpdateLicenseKeysDTO {
  @ApiProperty()
   licenseKeys: string[] ;
}
