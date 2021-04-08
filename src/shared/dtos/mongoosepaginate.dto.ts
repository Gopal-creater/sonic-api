import { ApiProperty } from '@nestjs/swagger';

export class MongoosePaginateDto<T> {
  @ApiProperty()
  docs: [T];

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
