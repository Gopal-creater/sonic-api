import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { RadioStationSonicKey } from '../schemas/radiostation-sonickey.schema';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { RadioStation } from '../schemas/radiostation.schema';
import { SonicKey } from '../../sonickey/schemas/sonickey.schema';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { RadiostationService } from './radiostation.service';
import { MongoosePaginateRadioStationSonicKeyDto } from '../dto/mongoosepaginate-radiostationsonickey.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';

@Injectable()
export class RadiostationSonicKeysService {
  constructor(
    @InjectModel(RadioStationSonicKey.name)
    public radioStationSonickeyModel: Model<RadioStationSonicKey>,
    public radiostationService: RadiostationService,
    private sonickeyService: SonickeyService,
  ) {}
  private readonly streamingLogger = new Logger('Streaming');

  async create(
    createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto,
  ): Promise<RadioStationSonicKey> {
    const newRadioStationSonicKey = new this.radioStationSonickeyModel({
      ...createRadiostationSonicKeyDto,
    });
    return newRadioStationSonicKey.save();
  }

  async createOrUpdate(
    createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto,
  ): Promise<RadioStationSonicKey> {
    const presentData = await this.findOne(createRadiostationSonicKeyDto.radioStation,createRadiostationSonicKeyDto.sonicKey) 
    if(!presentData){
      //If not present create with default values 
      var newRadioStationSonicKey = new this.radioStationSonickeyModel({
        ...createRadiostationSonicKeyDto
      });
      newRadioStationSonicKey.count=1;
      newRadioStationSonicKey.detectedDetails.push({detectedAt:new Date()})
      return newRadioStationSonicKey.save();
    }else{
      //If present update count and detectedDate and update it 
      presentData.count=presentData.count+1
      presentData.detectedDetails.unshift({detectedAt:new Date()})
      return presentData.save();
    }
  }

  async findAll(queryDto: ParsedQueryDto):Promise<any> {
    const { limit,skip,sort,page,filter,select, populate} = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;


    return await this.radioStationSonickeyModel["paginate"](filter,paginateOptions)
  }

  async findTopRadioStations(filter:object,topLimit:number){
    const top3RadioStations: {
      _id: string;
      totalKeysDetected: number;
      radioStation:RadioStation
    }[] = await this.radioStationSonickeyModel.aggregate(
      [
        { $match: filter },
        { $group: { _id: '$radioStation', totalKeysDetected: { $sum: '$count' } } },
        { 
          $lookup: {
             from: "RadioStation",
             localField : "_id",
             foreignField: "_id",
             as: "radioStation"
           }
     },
        { $sort: { totalKeysDetected: -1 } }, //to get higest first
        { $limit: topLimit},
      ],
    );
    return top3RadioStations
  }

  async findOne(radioStation: string, sonicKey: string) {
    return this.radioStationSonickeyModel.findOne({
      radioStation: radioStation,
      sonicKey: sonicKey,
    });
  }


  async findById(id: string) {
    return this.radioStationSonickeyModel.findById(id);
  }
}
