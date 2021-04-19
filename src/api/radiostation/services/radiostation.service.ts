import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { RadioStation } from '../../../schemas/radiostation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import children from 'child_process';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SonickeyService } from '../../sonickey/sonickey.service';
import { STOP_LISTENING, START_LISTENING } from '../listeners/constants';

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

    this.eventEmitter.emit(STOP_LISTENING,radioStation)
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
    this.eventEmitter.emit(START_LISTENING,radioStation)
    return this.radioStationModel.findOneAndUpdate(
      { _id: id },
      {
        startedAt: new Date(),
        isStreamStarted: true,
      },
      { new: true },
    );
  }

  async findAll(queryDto: QueryDto = {}) {
    const { limit, offset, ...query } = queryDto;
    const options = {
      limit,
      offset,
    };
    // return await this.sonicKeyModel["paginate"](query || {},options) as MongoosePaginateDto<SonicKey>
    return this.radioStationModel
      .find(query || {})
      .skip(offset)
      .limit(limit)
      .exec();
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
    return this.radioStationModel.remove(id);
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

  startListeningLikeAStream(streamUrl: string, outputPath: string) {
    var ffm = children.spawn(
      'ffmpeg',
      `-i ${streamUrl} -f 16_le -ar 41000 -ac 2 -f wav -t 00:00:10 ${outputPath}`.split(
        ' ',
      ),
    );

    ffm.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
    });

    ffm.stderr.on('data', data => {
      console.error(`stderr: ${data}`);
    });

    ffm.on('close', code => {
      // this.startListeningLikeAStream(streamUrl,outputPath)
      // this.sonickeyService.decodeAllKeys()
      console.log(`child process exited with code ${code}`);
    });
  }
}
