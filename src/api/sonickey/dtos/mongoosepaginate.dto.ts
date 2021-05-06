import { ApiProperty } from '@nestjs/swagger';
import { SonicKey } from '../schemas/sonickey.schema';

export class MongoosePaginateDto {
  @ApiProperty({isArray:true,type:SonicKey})
  docs: [SonicKey];

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
