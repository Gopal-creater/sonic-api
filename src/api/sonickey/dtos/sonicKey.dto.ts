import { ApiProperty } from '@nestjs/swagger';

export class SonicKeyDto {

  @ApiProperty()
  encodingStrength?: number=10;


  @ApiProperty()
  contentType?: string;


  @ApiProperty()
  contentDescription?: string;

  @ApiProperty()
  contentCreatedDate?: Date;

  @ApiProperty()
  contentDuration?: number;


  @ApiProperty()
  contentSize?: number;


  @ApiProperty()
  contentFilePath?: string;


  @ApiProperty()
  contentFileType?: string;

  @ApiProperty()
  contentEncoding?: string;


  @ApiProperty()
  contentSamplingFrequency?: string;

  @ApiProperty()
  isrcCode?: string;

  @ApiProperty()
  iswcCode?: string;

  @ApiProperty()
  tuneCode?: string;


  @ApiProperty()
  contentName?: string;


  @ApiProperty()
  contentOwner?: string;


  @ApiProperty()
  contentValidation?: boolean;


  @ApiProperty()
  contentFileName?: string;


  @ApiProperty()
  contentQuality?: string;


  @ApiProperty()
  additionalMetadata?: { [key: string]: any };
}
