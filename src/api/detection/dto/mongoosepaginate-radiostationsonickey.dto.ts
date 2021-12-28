import { ApiProperty } from '@nestjs/swagger';
import { Detection } from '../schemas/detection.schema';
import { PlaysListResponseDto } from './general.dto';

export class MongoosePaginateDeectionDto {
  @ApiProperty({isArray:true,type:Detection})
  docs: [Detection];

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


export class MongoosePaginatePlaysDto {
  @ApiProperty({isArray:true,type:PlaysListResponseDto})
  docs: [PlaysListResponseDto];

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