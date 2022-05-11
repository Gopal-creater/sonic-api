import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Track } from '../schemas/track.schema';

export class MongoosePaginateTrackDto {
  @ApiProperty({isArray:true,type:Track})
  docs: [Track];

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