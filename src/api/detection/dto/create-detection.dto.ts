import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { ChannelEnums } from 'src/constants/Enums';
import { IsArray, IsDefined, IsIn, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { DetectedTimeStamp } from '../schemas/detection.schema';
import { DecodeResponseFromBinaryDto, DecodeResponseFromFingerPrintDto } from './general.dto';
import { Type } from 'class-transformer';

export class CreateDetectionDto {
  @ApiProperty()
  radioStation: string;

  @ApiProperty()
  @IsNotEmpty()
  sonicKey: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsIn([Object.values(ChannelEnums)])
  channel: string;

  // @ApiProperty()
  // licenseKey: string;

  // @ApiProperty()
  // owner: string;

  @ApiProperty()
  detectedAt: Date;

  @ApiProperty()
  metaData?: Map<string, any>;
}

export class CreateDetectionFromBinaryDto {
  @ApiProperty()
  sonicKey: string;

  @ApiProperty()
  detectedAt: Date = new Date();

  @ApiProperty()
  metaData: Map<string, any>;
}

export class ThirdPartyStreamReaderDetectionDto {
  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  detectedAt: Date;

  @ApiProperty()
  metaData: Map<string, any>;
}

export class CreateThirdPartyStreamReaderDetectionFromBinaryDto {
  @ApiProperty()
  @IsNotEmpty()
  sonicKey: string;

  @ApiProperty()
  @IsOptional()
  detectedAt: Date = new Date();

  @ApiProperty()
  @IsOptional()
  metaData: Map<string, any>;

  @IsNotEmpty()
  @ApiProperty()
  thirdpartyStreamReaderDetection: ThirdPartyStreamReaderDetectionDto;
}
export class CreateThirdPartyStreamReaderDetectionFromLamdaDto {
  @ApiProperty({isArray:true,type:DecodeResponseFromBinaryDto})
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DecodeResponseFromBinaryDto)
  decodeResponsesFromBinary: DecodeResponseFromBinaryDto[];

  @ApiProperty()
  @IsNotEmpty()
  radioStation: string;

  @ApiProperty()
  @IsOptional()
  detectedAt: Date = new Date();

  @ApiProperty()
  @IsNotEmpty()
  streamDetectionInterval:number

  @ApiProperty()
  detectionSourceFileName:string

  @ApiProperty()
  @IsOptional()
  metaData: Map<string, any>;
}

export class CreateThirdPartyStreamReaderDetectionFromFingerPrintDto {
  @ApiProperty({isArray:true,type:DecodeResponseFromFingerPrintDto})
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DecodeResponseFromFingerPrintDto)
  decodeResponsesFromFingerPrint: DecodeResponseFromFingerPrintDto[];

  @ApiProperty()
  @IsNotEmpty()
  radioStation: string;

  @ApiProperty()
  @IsOptional()
  detectedAt: Date = new Date();

  @ApiProperty()
  @IsNotEmpty()
  streamDetectionInterval:number

  @ApiProperty()
  detectionSourceFileName:string

  @ApiProperty()
  @IsOptional()
  metaData: Map<string, any>;
}

export class CreateDetectionFromHardwareDto {
  @ApiProperty()
  sonicKey: string;

  @ApiProperty()
  detectedAt: Date = new Date();

  @ApiProperty()
  metaData: Map<string, any>;

  //   @ApiProperty()
  //   channel: string = ChannelEnums.HARDWARE;
}
