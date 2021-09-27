import { ApiProperty } from '@nestjs/swagger';
import { RadioMonitor } from '../schemas/radiomonitor.schema';

export class MongoosePaginateRadioMonitorDto {
  @ApiProperty({isArray:true,type:RadioMonitor})
  docs: [RadioMonitor];

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
