import { ApiProperty } from '@nestjs/swagger';
import { JobFile } from '../schemas/jobfile.schema';

export class MongoosePaginateJobFileDto {
  @ApiProperty({isArray:true,type:JobFile})
  docs: [JobFile];

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
