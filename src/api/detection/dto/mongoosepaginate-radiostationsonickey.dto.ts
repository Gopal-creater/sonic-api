import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Detection } from '../schemas/detection.schema';
import { PlaysByArtistDto, PlaysByCountryDto, PlaysListResponseDto, PlaysByTrackDto, PlaysByRadioStationDto } from './general.dto';

export class MongoosePaginateDetectionDto {
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

export class MongoosePaginatePlaysByArtistDto extends OmitType(MongoosePaginatePlaysDto,['docs']) {
  @ApiProperty({isArray:true,type:PlaysByArtistDto})
  docs: [PlaysByArtistDto];
}
export class MongoosePaginatePlaysByCountryDto extends OmitType(MongoosePaginatePlaysDto,['docs']) {
  @ApiProperty({isArray:true,type:PlaysByCountryDto})
  docs: [PlaysByCountryDto];
}
export class MongoosePaginatePlaysByTrackDto extends OmitType(MongoosePaginatePlaysDto,['docs']) {
  @ApiProperty({isArray:true,type:PlaysByTrackDto})
  docs: [PlaysByTrackDto];
}
export class MongoosePaginatePlaysByRadioStationDto extends OmitType(MongoosePaginatePlaysDto,['docs']) {
  @ApiProperty({isArray:true,type:PlaysByRadioStationDto})
  docs: [PlaysByRadioStationDto];
}