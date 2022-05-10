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
    contentType: string; //mimetype
  
    @ApiProperty()
    contentDuration?: number;
  
    @ApiProperty()
    contentSize?: number;
  
    @ApiProperty()
    contentFilePath: string; //Path where it is saved
  
    @ApiProperty()
    s3OriginalFileMeta?: S3FileMeta; 
  
    @ApiProperty()
    contentFileType: string; //Music|Audio|Video
  
    @ApiProperty()
    contentEncoding: string;
  
    @ApiProperty()
    contentSamplingFrequency: string;
  
    @ApiProperty()
    originalFileName: string;
  
    @ApiProperty()
    iExtractedMetaData: any;
  }

  export class UploadTrackDto {
    @IsNotEmpty()
    @ApiProperty({ type: 'string', format: 'binary' })
    mediaFile: any;
  
    @ApiProperty()
    channel: string;
  }