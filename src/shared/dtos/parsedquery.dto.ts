import { ApiProperty,ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { QueryOptions } from 'mongoose-query-parser';
import { groupByTime } from 'src/shared/types';

export class ParsedQueryDto implements QueryOptions {
  @ApiHideProperty()
  filter: any;

  @ApiHideProperty()
  sort?: any;

  @ApiHideProperty()
  limit?: number;

  @ApiHideProperty()
  skip?: number;

  @ApiHideProperty()
  select?: any;

  @ApiHideProperty()
  populate?: any;

  @ApiHideProperty()
  page?:number;

  @ApiHideProperty()
  topLimit?:number;

  @ApiHideProperty()
  includeGraph?:boolean;

  @ApiHideProperty()
  groupByTime?:groupByTime;
}
