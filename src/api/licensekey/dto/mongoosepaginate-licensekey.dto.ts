import { ApiProperty } from '@nestjs/swagger';
import { LicenseKey } from '../schemas/licensekey.schema'

export class MongoosePaginateLicensekeyDto {
  @ApiProperty({isArray:true,type:LicenseKey})
  docs: [LicenseKey];

  @ApiProperty()
  totalDocs: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pagingCounter: number;

  @ApiProperty()
  hasPrevPage: boolean;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  prevPage: number;

  @ApiProperty()
  nextPage: number;
}
