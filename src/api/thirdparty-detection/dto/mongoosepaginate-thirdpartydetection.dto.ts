import { ApiProperty } from '@nestjs/swagger';
import { ThirdpartyDetection } from '../schemas/thirdparty-detection.schema';

export class MongoosePaginateThirdPartyDetectionDto {
  @ApiProperty({isArray:true,type:ThirdpartyDetection})
  docs: [ThirdpartyDetection];

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
