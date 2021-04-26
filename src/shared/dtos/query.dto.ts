import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { PaginationQueryDto } from './paginationquery.dto';

export class QueryDto extends PaginationQueryDto {
  @IsOptional()
  @ApiProperty()
  filter?: Record<string,any>;
}
