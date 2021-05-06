import { ApiProperty } from '@nestjs/swagger';
import { RadioStationSonicKey } from '../schemas/radiostation-sonickey.schema';

export class MongoosePaginateRadioStationSonicKeyDto {
  @ApiProperty({isArray:true,type:RadioStationSonicKey})
  docs: [RadioStationSonicKey];

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
