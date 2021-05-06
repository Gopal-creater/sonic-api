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

  async findAll(queryDto: QueryDto = {}):Promise<MongoosePaginateRadioStationSonicKeyDto> {
    const { _limit, _offset, _sort,_page, ...query } = queryDto;
    var paginateOptions={}
    var sort = {};
    if (_sort) {
      var sortItems = _sort?.split(',') || [];
      for (let index = 0; index < sortItems.length; index++) {
        const sortItem = sortItems[index];
        var sortKeyValue = sortItem?.split(':');
        sort[sortKeyValue[0]] =
          sortKeyValue[1]?.toLowerCase() == 'desc' ? -1 : 1;
      }
    }

    paginateOptions["sort"]=sort
    paginateOptions["offset"]=_offset
    paginateOptions["page"]=_page
    paginateOptions["limit"]=_limit


    return await this.radioStationSonickeyModel["paginate"](query,paginateOptions)
    // return this.radioStationSonickeyModel
    //   .find(query || {})
    //   .skip(_offset)
    //   .limit(_limit)
    //   .sort(sort)
    //   .exec();
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
