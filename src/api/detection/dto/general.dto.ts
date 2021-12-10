import { ApiProperty } from '@nestjs/swagger';
import { SonicKey } from 'src/api/sonickey/schemas/sonickey.schema';
import { RadioStation } from '../../radiostation/schemas/radiostation.schema';

export class TopRadioStation{

    @ApiProperty()
    _id: string;
  
    @ApiProperty()
    totalKeysDetected: number;
  
    @ApiProperty()
    radioStation: RadioStation;
  };
  
  export class TopSonicKey {
    @ApiProperty()
    _id: string;
  
    @ApiProperty()
    totalHits: number;
  
    @ApiProperty()
    sonicKey: SonicKey;
  };

  export class PlaysCountResponseDto {
    @ApiProperty()
    _id: string;
  
    @ApiProperty()
    playsCount: number;
  
    @ApiProperty()
    uniquePlaysCount: number;
  };
  
  export class GraphData{
    @ApiProperty()
    _id: any;
  
    @ApiProperty()
    year: number;
  
    @ApiProperty()
    month: number;
  
    @ApiProperty()
    day: number;
  
    @ApiProperty()
    hits: number;
  }
  
  export class TopRadioStationWithTopSonicKey extends TopRadioStation {
    @ApiProperty()
    sonicKeys:TopSonicKey[]
  
    @ApiProperty()
    graphsData?:GraphData[]
  } 

  export class TopRadioStationWithPlaysDetails extends TopRadioStation {
    @ApiProperty()
    playsCount:PlaysCountResponseDto
  }