import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SonicKey } from 'src/api/sonickey/schemas/sonickey.schema';
import { RadioStation } from '../../radiostation/schemas/radiostation.schema';
import { DetectedTimeStamp } from '../schemas/detection.schema';
import { UserDB } from '../../user/schemas/user.db.schema';
import { Company } from '../../company/schemas/company.schema';
import { Partner } from 'src/api/partner/schemas/partner.schema';

export class TopRadioStation{

    @ApiProperty()
    _id?: string;
  
    @ApiProperty()
    totalKeysDetected?: number;
  
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
    _id?: string;
  
    @ApiProperty()
    playsCount: number;
  
    @ApiProperty()
    uniquePlaysCount: number;
  };

  export class PlaysGraphSingleResponseDto {
    @ApiProperty()
    _id: string;
  
    @ApiProperty()
    total: number;
  };

  export class PlaysGraphResponseDto {
    @ApiProperty()
    playsArtistWise?: PlaysGraphSingleResponseDto[];
  
    @ApiProperty()
    playsCountryWise?: PlaysGraphSingleResponseDto[];

    @ApiProperty()
    playsSongWise?: PlaysGraphSingleResponseDto[];
  
    @ApiProperty()
    playsStationWise?: PlaysGraphSingleResponseDto[];
  };

  export class PlaysListResponseDto {
    @ApiProperty()
    _id?: string;

    @ApiProperty()
    detectedAt?: Date;

    @ApiProperty()
    owner?: UserDB;

    @ApiProperty()
    company?: Company;

    @ApiProperty()
    partner?: Partner;

    @ApiProperty()
    channel?: string;

    @ApiProperty()
    detectedDuration?: number;
  
    @ApiProperty()
    radioStation: RadioStation;
  
    @ApiProperty()
    sonicKey: SonicKey;

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
  };

  export class PlaysByArtistDto{
    @ApiProperty()
    artist:string;

    @ApiProperty()
    playsCount:number

    @ApiProperty()
    uniquePlaysCount:number

    @ApiProperty()
    radioStationCount:number

    @ApiProperty()
    countriesCount:number
  }

  export class PlaysByCountryDto{
    @ApiProperty()
    country:string;

    @ApiProperty()
    playsCount:number

    @ApiProperty()
    uniquePlaysCount:number

    @ApiProperty()
    radioStationCount:number

    @ApiProperty()
    artistsCount:number
  }

  export class PlaysByTrackDto{
    @ApiProperty()
    trackName:string;

    @ApiProperty()
    playsCount:number

    @ApiProperty()
    uniquePlaysCount:number

    @ApiProperty()
    radioStationCount:number

    @ApiProperty()
    countriesCount:number
  }

  export class PlaysByRadioStationDto{
    @ApiProperty()
    radioStation:RadioStation;

    @ApiProperty()
    playsCount:number

    @ApiProperty()
    uniquePlaysCount:number

    @ApiProperty()
    artistsCount:number

    @ApiProperty()
    countriesCount:number
  }
  
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

  export class DecodeResponseFromBinaryDto {

    @ApiProperty()
    @IsNotEmpty()
    sonicKey: string;

    @ApiProperty({isArray:true,type:DetectedTimeStamp})
    timestamps:DetectedTimeStamp[]
  }