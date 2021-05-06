import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { RadioStation } from '../schemas/radiostation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { STOP_LISTENING_STREAM, START_LISTENING_STREAM } from '../listeners/constants';
import { MongoosePaginateRadioStationDto } from '../dto/mongoosepaginate-radiostation.dto';

@Injectable()
export class RadiostationService {
  constructor(
    @InjectModel(RadioStation.name)
    public readonly radioStationModel: Model<RadioStation>,
    public readonly sonickeyService: SonickeyService,
    private readonly eventEmitter: EventEmitter2
  ) {}
  create(createRadiostationDto: CreateRadiostationDto) {
    const newRadioStation = new this.radioStationModel(createRadiostationDto);
    return newRadioStation.save();
  }

  async stopListeningStream(id: string) {
    const radioStation = await this.radioStationModel.findById(id);
    if (!radioStation) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    if (!radioStation.isStreamStarted) {
      return radioStation;
    }

    this.eventEmitter.emit(STOP_LISTENING_STREAM,radioStation)
    //Do Stop Listening Stuff
    return this.radioStationModel.findOneAndUpdate(
      { _id: id },
      {
        stopAt: new Date(),
        isStreamStarted: false,
      },
      { new: true },
    );
  }

  async startListeningStream(id: string) {
    const radioStation = await this.radioStationModel.findById(id);
    if (!radioStation) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    if (radioStation.isStreamStarted) {
      return radioStation;
    }
    //https://nodejs.org/api/worker_threads.html
    //Do Start Listening Stuff
    this.eventEmitter.emit(START_LISTENING_STREAM,radioStation)
    return this.radioStationModel.findOneAndUpdate(
      { _id: id },
      {
        startedAt: new Date(),
        isStreamStarted: true,
        error:null
      },
      { new: true },
    );
  }

  async findAll(queryDto: QueryDto = {}):Promise<MongoosePaginateRadioStationDto> {
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


    return await this.radioStationModel["paginate"](query,paginateOptions)

    // return this.radioStationModel
    //   .find(query || {})
    //   .skip(_offset)
    //   .limit(_limit)
    //   .sort(sort)
    //   .exec();
  }

  async findByIdOrFail(id: string) {
    const radioStation = await this.radioStationModel.findById(id);
    if (!radioStation) {
      throw new NotFoundException();
    }
    return radioStation;
  }

  async removeById(id: string) {
    const radioStation = await this.radioStationModel.findById(id);
    if (!radioStation) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    return this.radioStationModel.findByIdAndRemove(id);
  }

  async bulkRemove(ids: [string]) {
    const promises = ids.map(id =>
      this.removeById(id).catch(err => ({ promiseError: err, data: id })),
    );
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: string;
      }[];
      const passedData = values.filter(
        item => !item['promiseError'],
      ) as RadioStation[];
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }

  async bulkStartListeningStream(ids: [string]) {
    const promises = ids.map(id =>
      this.startListeningStream(id).catch(err => ({
        promiseError: err,
        data: id,
      })),
    );
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: string;
      }[];
      const passedData = values.filter(
        item => !item['promiseError'],
      ) as RadioStation[];
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }

  async bulkStopListeningStream(ids: [string]) {
    const promises = ids.map(id =>
      this.stopListeningStream(id).catch(err => ({
        promiseError: err,
        data: id,
      })),
    );
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: string;
      }[];
      const passedData = values.filter(
        item => !item['promiseError'],
      ) as RadioStation[];
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }
}
