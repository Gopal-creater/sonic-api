import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { RadioMonitor } from './schemas/radiomonitor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RadiostationService } from '../radiostation/services/radiostation.service';
import { CreateRadioMonitorDto } from './dto/create-radiomonitor.dto';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateRadioMonitorDto } from './dto/mongoosepaginate-radiomonitordto';
import { MonitorGroupsEnum } from 'src/constants/Enums';
import { UserService } from '../user/user.service';

@Injectable()
export class RadioMonitorService {
  constructor(
    @InjectModel(RadioMonitor.name)
    public readonly radioMonitorModel: Model<RadioMonitor>,
    public readonly radiostationService: RadiostationService,
    public readonly licensekeyService: LicensekeyService,
    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
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
    // if (!isValidRadioStation.isStreamStarted) {
    //   return Promise.reject({
    //     status: 422,
    //     message:
    //       'Can not subscribe to this radio station since this radio station has not listening for any streams currently.',
    //   });
    // }
    // if (isValidRadioStation.isError) {
    //   return Promise.reject({
    //     status: 422,
    //     message:
    //       'Can not subscribe to this radio station since this radio station has facing error currently.',
    //   });
    // }
    const newMonitor = await this.radioMonitorModel.create({
      radio: radio,
      radioSearch: isValidRadioStation,
      isListeningStarted: true,
      owner: owner,
      license: license,
    });
    const savedMonitor = await newMonitor.save();
    await this.licensekeyService
      .incrementUses(license, 'monitor', 1)
      .catch(async err => {
        await this.radioMonitorModel.findOneAndDelete({ _id: savedMonitor.id });
        return Promise.reject({
          status: 422,
          message: err?.message,
        });
      });
    return savedMonitor;
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

  /**
   * Only use , if you are sure about the valid payload such as radio, owner, license etc..
   * @param createRadioMonitorsDto
   * @param owner
   * @param license
   * @returns
   */
  async subscribeRadioToMonitorBulkWithInsertManyOperation(
    radioMonitors: any[],
  ) {
    const isAllowedForSubscribe = await this.licensekeyService.allowedForIncrementUses(
      radioMonitors?.[0]?.license,
      'monitor',
      radioMonitors.length,
    );
    if (!isAllowedForSubscribe) {
      return Promise.reject({
        status: 422,
        message: `Not allowed for subscription deuto invalid license :${radioMonitors?.[0]?.license}`,
      });
    }
    const inserted = await this.radioMonitorModel.collection.insertMany(
      radioMonitors,
    );
    await this.licensekeyService.incrementUses(
      radioMonitors?.[0]?.license,
      'monitor',
      inserted.insertedCount,
    );

    return inserted;
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

  //Dont do anything for now, simply return the radio monitor data
  async stopListeningStream(id: string) {
    const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
    if (!isValidRadioMonitor) {
      return Promise.reject({
        status: 404,
        message: 'Not found',
      });
    }
    // return this.radioMonitorModel.findOneAndUpdate(
    //   { _id: id },
    //   {
    //     stopAt: new Date(),
    //     isListeningStarted: false
    //   },
    //   { new: true },
    // );
    return isValidRadioMonitor;
  }

  async startListeningStream(id: string) {
    const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
    if (!isValidRadioMonitor) {
      return Promise.reject({
        status: 404,
        message: 'Not found',
      });
    }
    //Simply return the same validRadioMonitor if it is already listening
    if (isValidRadioMonitor.isListeningStarted) {
      return isValidRadioMonitor;
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
    // if (!isValidRadioStation.isStreamStarted) {
    //   return Promise.reject({
    //     status: 422,
    //     message:
    //       'Can not start listening to this radio station since this radio station has not listening for any streams currently.',
    //   });
    // }
    // if (isValidRadioStation.isError) {
    //   return Promise.reject({
    //     status: 422,
    //     message:
    //       'Can not start listening to this radio station since this radio station has facing error currently.',
    //   });
    // }

    return this.radioMonitorModel.findOneAndUpdate(
      { _id: id },
      {
        startedAt: new Date(),
        isListeningStarted: true,
        radioSearch: isValidRadioStation,
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

  async addUserFromHisMonitoringGroupToSubscribeRadioMonitoring(
    usernameOrSub: string,
    unlimitedMonitoringLicense?: string,
  ) {
    const user = await this.userService.getUserProfile(usernameOrSub, true);
    if (!user) {
      return Promise.reject({
        status: 404,
        message: 'User not found',
      });
    }
    if (!unlimitedMonitoringLicense) {
      const validLicence = await this.licensekeyService.findUnlimitedMonitoringLicenseForUser(
        user.sub,
      );
      if (!validLicence) {
        return Promise.reject({
          status: 422,
          message: 'There is no valid license.',
        });
      }
      unlimitedMonitoringLicense = validLicence.key;
    }
    var aimSaveDataResult, afemSaveDataResult;
    for await (const group of user.groups || []) {
      if (group == MonitorGroupsEnum.AIM) {
        const radiosAlreadyMonitors: string[] = await this.radioMonitorModel.aggregate(
          [
            {
              $match: { owner: user.sub },
            },
            { $group: { _id: '$radio', ids: { $push: '$radio' } } },
          ],
        );
        console.log('radiosAlreadyMonitors AIM', radiosAlreadyMonitors);
        const radiosToMonitor = await this.radiostationService.radioStationModel.find(
          {
            'monitorGroups.name': group,
            _id: { $nin: radiosAlreadyMonitors },
          },
        );
        console.log('radiosToMonitor AIM', radiosToMonitor.length);
        const radioMonitors = radiosToMonitor.map(rd => {
          return {
            radio: rd._id,
            owner: user.sub,
            license: unlimitedMonitoringLicense,
            radioSearch: rd,
            isListeningStarted: true,
          };
        });

        aimSaveDataResult = await this.subscribeRadioToMonitorBulkWithInsertManyOperation(radioMonitors)
      }

      if (group == MonitorGroupsEnum.AFEM) {
        const radiosAlreadyMonitors: string[] = await this.radioMonitorModel.aggregate(
          [
            {
              $match: { owner: user.sub },
            },
            { $group: { _id: '$radio', ids: { $push: '$radio' } } },
          ],
        );
        console.log('radiosAlreadyMonitors AFEM', radiosAlreadyMonitors);
        const radiosToMonitor = await this.radiostationService.radioStationModel.find(
          {
            'monitorGroups.name': group,
            _id: { $nin: radiosAlreadyMonitors },
          },
        );
        console.log('radiosToMonitor AFEM', radiosToMonitor.length);
        const radioMonitors = radiosToMonitor.map(rd => {
          return {
            radio: rd._id,
            owner: user.sub,
            license: unlimitedMonitoringLicense,
            radioSearch: rd,
            isListeningStarted: true,
          };
        });

        afemSaveDataResult =await this.subscribeRadioToMonitorBulkWithInsertManyOperation(radioMonitors)
      }
    }

    return {
      aimSaveDataResult: aimSaveDataResult,
      afemSaveDataResult: afemSaveDataResult,
    };
  }
}
