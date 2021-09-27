import { Injectable, NotFoundException } from '@nestjs/common';
import { RadioMonitor } from './schemas/radiomonitor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RadiostationService } from '../radiostation/services/radiostation.service';
import { CreateRadioMonitorDto } from './dto/create-radiomonitor.dto';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateRadioMonitorDto } from './dto/mongoosepaginate-radiomonitordto';

@Injectable()
export class RadioMonitorService {
  constructor(
    @InjectModel(RadioMonitor.name)
    public readonly radioMonitorModel: Model<RadioMonitor>,
    public readonly radiostationService: RadiostationService,
    public readonly licensekeyService: LicensekeyService,
  ) {}


  async findAll(
    queryDto: ParsedQueryDto,
  ): Promise<MongoosePaginateRadioMonitorDto> {
    const { limit, skip, sort, page, filter, select, populate } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    return this.radioMonitorModel['paginate'](filter, paginateOptions);
  }

  async subscribeRadioToMonitor(
    createRadioMonitorDto: CreateRadioMonitorDto,
    owner: string,
    license: string,
  ) {
    const { radio } = createRadioMonitorDto;
    const isValidRadioStation = await this.radiostationService.radioStationModel.findById(
      radio,
    );
    if (!isValidRadioStation) {
      return Promise.reject({
        status: 404,
        message: 'Radiostation not found',
      });
    }
    if (isValidRadioStation.isStreamStarted) {
      return Promise.reject({
        status: 422,
        message:
          'Can not subscribe to this radio station since this radio station has not listening for any streams currently.',
      });
    }
    if (isValidRadioStation.isError) {
      return Promise.reject({
        status: 422,
        message:
          'Can not subscribe to this radio station since this radio station has facing error currently.',
      });
    }
    const newMonitor = await this.radioMonitorModel.create({
      radio: radio,
      owner: owner,
      license: license,
    });
    const savedMonitor = await newMonitor.save();
    await this.licensekeyService.incrementUses(license,'monitor',1)
    .catch(async err=>{
      await this.radioMonitorModel.findOneAndDelete({_id:savedMonitor.id})
      return Promise.reject({
        status: 422,
        message:err?.message,
      })
    })
    return savedMonitor
  }

  async subscribeRadioToMonitorBulk(
    createRadioMonitorsDto: CreateRadioMonitorDto[],
    owner: string,
    license: string,
  ) {
    const promises = createRadioMonitorsDto.map(createRadioMonitorDto =>
      this.subscribeRadioToMonitor(createRadioMonitorDto, owner, license).catch(
        err => ({
          promiseError: err,
          data: createRadioMonitorDto,
        }),
      ),
    );
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: CreateRadioMonitorDto;
      }[];
      const passedData = values.filter(
        item => !item['promiseError'],
      ) as RadioMonitor[];
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }

  async findByIdOrFail(id: string) {
    const radioMonitor = await this.radioMonitorModel.findById(id);
    if (!radioMonitor) {
      throw new NotFoundException();
    }
    return radioMonitor;
  }

  async unsubscribeById(id: string) {
    const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
    if (!isValidRadioMonitor) {
      return Promise.reject({
        status: 404,
        message: 'Not found',
      });
    }
    return this.radioMonitorModel.findByIdAndRemove(id);
  }

  async unsubscribeBulk(ids: [string]) {
    const promises = ids.map(id =>
      this.unsubscribeById(id).catch(err => ({ promiseError: err, data: id })),
    );
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: string;
      }[];
      const passedData = values.filter(
        item => !item['promiseError'],
      ) as RadioMonitor[];
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }

  async stopListeningStream(id: string) {
    const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
    if (!isValidRadioMonitor) {
      return Promise.reject({
        status: 404,
        message: 'Not found',
      });
    }
    return this.radioMonitorModel.findOneAndUpdate(
      { _id: id },
      {
        stopAt: new Date(),
        isListeningStarted: false,
      },
      { new: true },
    );
  }

  async startListeningStream(id: string) {
    const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
    if (!isValidRadioMonitor) {
      return Promise.reject({
        status: 404,
        message: 'Not found',
      });
    }
    const { radio } = isValidRadioMonitor;
    const isValidRadioStation = await this.radiostationService.radioStationModel.findById(
      radio,
    );
    if (!isValidRadioStation) {
      return Promise.reject({
        status: 404,
        message: 'Radiostation not found',
      });
    }
    if (isValidRadioStation.isStreamStarted) {
      return Promise.reject({
        status: 422,
        message:
          'Can not start listening to this radio station since this radio station has not listening for any streams currently.',
      });
    }
    if (isValidRadioStation.isError) {
      return Promise.reject({
        status: 422,
        message:
          'Can not start listening to this radio station since this radio station has facing error currently.',
      });
    }

    return this.radioMonitorModel.findOneAndUpdate(
      { _id: id },
      {
        startedAt: new Date(),
        isListeningStarted: true,
        error: null,
        isError: false,
      },
      { new: true },
    );
  }

  async startListeningStreamBulk(ids: [string]) {
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
      ) as RadioMonitor[];
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }

  async stopListeningStreamBulk(ids: [string]) {
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
      ) as RadioMonitor[];
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }
}
