import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class CreateSonicKeyFromJobDto extends SonicKeyDto {
    @IsNotEmpty()
    @ApiProperty()
    sonicKey:string

    @ApiProperty()
    contentFilePath:string

    @IsNotEmpty()
    @ApiProperty()
    job:string

    @IsNotEmpty()
    @ApiProperty()
    owner:string
 
    @ApiProperty()
    license:string

    @ApiProperty()
    licenseId:string
}


export class CreateSonicKeyFromBinaryDto extends SonicKeyDto {

    @IsNotEmpty()
    @ApiProperty()
    sonicKey:string

    @ApiProperty()
    contentFilePath:string

    @ApiProperty()
    originalFileName:string
}

class S3FileMetaDto {
    @ApiProperty()
    ETag: string;
  
    @ApiProperty()
    Location: string;
  
    @IsNotEmpty()
    @ApiProperty()
    key?: string;
  
    @IsNotEmpty()
    @ApiProperty()
    Key: string;
  
    @IsNotEmpty()
    @ApiProperty()
    Bucket: string;
  }

export class CreateSonicKeyDto {

    @ApiProperty()
    sonicKey?: string;

    @ApiProperty()
    owner?: string;
  
    @ApiProperty()
    company?: string;
  
    @ApiProperty()
    partner?: string;
  
    @ApiProperty()
    channel: string;
  
    @ApiProperty()
    channelUuid: string;
    
    @ApiProperty()
    encodingStrength?: number;
  
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
    s3FileMeta?: S3FileMetaDto;
  
    @ApiProperty()
    s3OriginalFileMeta?: S3FileMetaDto;
  
    @ApiProperty()
    contentFileType?: string;
  
    @ApiProperty()
    contentEncoding?: string;
  
    @ApiProperty()
    contentSamplingFrequency: string;
  
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
    originalFileName?: string;
  
    @ApiProperty()
    contentQuality?: string;
  
    @ApiProperty()
    additionalMetadata?: Map<string, any>;
  
    // client requirements
    @ApiProperty()
    isRightsHolderForEncode?: boolean;
  
    @ApiProperty()
    isAuthorizedForEncode?: boolean;
  
    @ApiProperty()
    distributor?: string;
  
    @ApiProperty()
    version?: string;
  
    @ApiProperty()
    label?: string;
  
    @ApiProperty()
    createdBy?: string;
  
    @ApiProperty()
    updatedBy?: string;
}