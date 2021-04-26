import { Injectable, BadRequestException } from '@nestjs/common';
import { RadioStationSonicKey } from '../../../schemas/radiostation-sonickey.schema';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { RadioStation } from '../../../schemas/radiostation.schema';
import { SonicKey } from '../../../schemas/sonickey.schema';

@Injectable()
export class RadiostationSonicKeysService {
  constructor(
    @InjectModel(RadioStationSonicKey.name)
    public radioStationSonickeyModel: Model<RadioStationSonicKey>,
    @InjectModel(RadioStation.name)
    public radioStationModel: Model<RadioStation>,
    @InjectModel(SonicKey.name)
    public sonicKeyModel: Model<SonicKey>,
  ) {}
  async create(
    createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto,
  ): Promise<RadioStationSonicKey> {
    const newRadioStationSonicKey = new this.radioStationSonickeyModel({
      ...createRadiostationSonicKeyDto,
      count: 1,
    });
    return newRadioStationSonicKey.save();
  }

  async findOrCreateAndIncrementCount(
    radioStation: string,
    sonicKey: string,
    count: number = 1,
  ) {
    const radioStationSonicKey = await this.findOne(radioStation, sonicKey);
    if (!radioStationSonicKey) {
      const newRadioStationSonicKey = new this.radioStationSonickeyModel({
        radioStation: radioStation,
        sonicKey: sonicKey,
        count: count,
      });
      return newRadioStationSonicKey.save();
    } else {
      radioStationSonicKey.count = radioStationSonicKey.count + count;
      return radioStationSonicKey.update();
    }
  }

  async findAll(queryDto: QueryDto = {}) {
    const { _limit, _start,_sort, ...query } = queryDto;
    var sort={}
    if(_sort){
      var sortItems = _sort?.split(',')||[]
      for (let index = 0; index < sortItems.length; index++) {
        const sortItem = sortItems[index];
        var sortKeyValue = sortItem?.split(':')
        sort[sortKeyValue[0]]=sortKeyValue[1]?.toLowerCase()=='desc' ? -1 : 1
      }
    }
    // return await this.sonicKeyModel["paginate"](query || {},options) as MongoosePaginateDto<SonicKey>
    return this.radioStationSonickeyModel
      .find(query || {})
      .skip(_start)
      .limit(_limit)
      .sort(sort)
      .exec();
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

  async incrementCount(
    radioStation: string,
    sonicKey: string,
    count: number = 1,
  ) {
    const radioStationSonicKey = await this.findOne(radioStation, sonicKey);
    if (!radioStationSonicKey) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    radioStationSonicKey.count = radioStationSonicKey.count + count;
    return radioStationSonicKey.update();
  }
}