import { ApiProperty } from '@nestjs/swagger';
import { ApiKey } from '../schemas/api-key.schema';

export class MongoosePaginateApiKeyDto {
  @ApiProperty({isArray:true,type:ApiKey})
  docs: [ApiKey];

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
