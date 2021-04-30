import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { RadioStationSonicKey } from '../../../schemas/radiostation-sonickey.schema';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { RadioStation } from '../../../schemas/radiostation.schema';
import { SonicKey } from '../../../schemas/sonickey.schema';
import { SonickeyService } from '../../sonickey/services/sonickey.service';

@Injectable()
export class RadiostationSonicKeysService {
  constructor(
    @InjectModel(RadioStationSonicKey.name)
    public radioStationSonickeyModel: Model<RadioStationSonicKey>,
    @InjectModel(RadioStation.name)
    public radioStationModel: Model<RadioStation>,
    @InjectModel(SonicKey.name)
    public sonicKeyModel: Model<SonicKey>,

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

  async findAll(queryDto: QueryDto = {}) {
    const { _limit, _start, _sort, ...query } = queryDto;
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
}
