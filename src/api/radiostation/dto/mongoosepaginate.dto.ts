import { ApiProperty } from '@nestjs/swagger';
import { RadioStation } from '../schemas/radiostation.schema';

export class MongoosePaginateDto {
  @ApiProperty({isArray:true,type:RadioStation})
  docs: [RadioStation];

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
