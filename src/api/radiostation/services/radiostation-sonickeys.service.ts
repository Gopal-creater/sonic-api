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
    public radioStationSonickeyModel: Model<RadioStationSonicKey>
  ) {}
  create(createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto):Promise<RadioStationSonicKey> {
    const newRadioStationSonicKey = new this.radioStationSonickeyModel({...createRadiostationSonicKeyDto,count:1})
    return newRadioStationSonicKey.save()
  }

  async findAll(queryDto: QueryDto = {}) {
    const { limit, offset, ...query } = queryDto;
    const options = {
      limit,
      offset,
    };
    // return await this.sonicKeyModel["paginate"](query || {},options) as MongoosePaginateDto<SonicKey>
    return this.radioStationSonickeyModel
      .find(query || {})
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findOne(radioStation: string, sonicKey: string) {
    return this.radioStationSonickeyModel.findOne({
      radioStation: new RadioStation({ id: radioStation }),
      sonicKey: new SonicKey({ id: sonicKey }),
    });
  }

  async findById(id: string) {
    return this.radioStationSonickeyModel.findById(id);
  }

  async incrementCount(radioStation: string, sonicKey: string) {
    const radioStationSonicKey = await this.findOne(radioStation, sonicKey);
    if (radioStationSonicKey) {
      radioStationSonicKey.count = radioStationSonicKey.count + 1;
      return radioStationSonicKey.update();
    }
  }
}
