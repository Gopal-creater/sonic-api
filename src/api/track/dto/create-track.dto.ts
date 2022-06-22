import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { S3FileMeta } from 'src/api/sonickey/schemas/sonickey.schema';

export class TrackDto {
  
  @ApiProperty()
  owner: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  partner: string;

  @ApiProperty()
  apiKey: any;

  @ApiProperty()
  channel: string;

  @ApiProperty()
  channelUuid: string;

  @ApiProperty()
  license: string;

  @ApiProperty()
  mimeType: string; //mimetype

  @ApiProperty()
  artist: string; //saved from encode dto, can not be changed later

  @ApiProperty()
  title: string; //saved from encode dto, can not be changed later

  @ApiProperty()
  duration?: number;

  @ApiProperty()
  fileSize?: number;

  @ApiProperty()
  localFilePath: string; //Path where it is saved

  @ApiProperty()
  s3OriginalFileMeta?: S3FileMeta; 

  @ApiProperty()
  fileType: string; //Music|Audio|Video

  @ApiProperty()
  encoding: string;

  @ApiProperty()
  samplingFrequency: string;

  @ApiProperty()
  originalFileName: string;

  @ApiProperty()
  iExtractedMetaData: any;

  @ApiProperty()
  createdByUser: string;

  @ApiProperty()
  updatedByUser: string;

  @ApiProperty()
  trackMetaData:Record<string,any>
  }

  export class UploadTrackDto {
    @IsNotEmpty()
    @ApiProperty({ type: 'string', format: 'binary' })
    mediaFile: any;
  
    @ApiProperty()
    channel?: string;

    @ApiProperty()
    @IsNotEmpty()
    artist: string;
  
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    owner?: string;
  
    @ApiProperty()
    company?: string;
  
    @ApiProperty()
    partner?: string;
  }