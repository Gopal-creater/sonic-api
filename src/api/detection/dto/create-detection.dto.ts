import { ApiProperty, OmitType,PickType } from '@nestjs/swagger';
import { ChannelEnums } from 'src/constants/Channels.enum';

export class CreateDetectionDto {
    @ApiProperty()
    radioStation: string;
  
    @ApiProperty()
    sonicKey: string;
  
    @ApiProperty()
    apiKey: string;
  
    @ApiProperty()
    licenseKey: string;
  
    @ApiProperty()
    owner: string;
  
    @ApiProperty()
    channel: string;
  
    @ApiProperty()
    channelUuid: string;
  
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
