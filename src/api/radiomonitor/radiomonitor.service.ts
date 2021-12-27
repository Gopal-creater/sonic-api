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
    documentLimit?: number,
  ): Promise<MongoosePaginateRadioMonitorDto> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      includeGroupData,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    if (!documentLimit) {
      return this.radioMonitorModel['paginate'](filter, paginateOptions);
    } else {
      const aggregate = this.radioMonitorModel.aggregate([
        {
          $match: {
            ...filter,
          },
        },
        {
          $limit: documentLimit,
        },
      ]);
      return this.radioMonitorModel['aggregatePaginate'](
        aggregate,
        paginateOptions,
      );
    }
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    // if (includeGroupData && filter.owner) {
    //   //If includeGroupData, try to fetch all data belongs to the user's groups and use the OR condition to fetch data
    //   const usergroups = await this.userService.adminListGroupsForUser(
    //     filter.owner,
    //   );
    //   if (usergroups.groupNames.length > 0) {
    //     filter['$or'] = [
    //       { groups: { $all: usergroups.groupNames } },
    //       { owner: filter.owner },
    //     ];
    //     delete filter.owner;
    //   }
    // }
    return this.radioMonitorModel
      .find(filter || {})
      .countDocuments()
      .exec();
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
    owner: string,
    validLicense: string,
  ) {
    if (radioMonitors.length <= 0) {
      return {};
    }
    const isAllowedForSubscribe = await this.licensekeyService.allowedForIncrementUses(
      validLicense,
      'monitor',
      radioMonitors.length,
    );
    if (!isAllowedForSubscribe) {
      return Promise.reject({
        status: 422,
        message: `Not allowed for monitoring subscription deuto invalid license :${validLicense}`,
      });
    }
    const inserted = await this.radioMonitorModel.collection.insertMany(
      radioMonitors,
    );
    await this.licensekeyService.incrementUses(
      validLicense,
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
    if (
      !(
        user?.groups?.includes(MonitorGroupsEnum.AIM) ||
        user?.groups?.includes(MonitorGroupsEnum.AFEM)
      )
    ) {
      return Promise.reject({
        status: 422,
        message: `Given user doesnot belongs to either of the monitoring group ${Object.values(
          MonitorGroupsEnum,
        ).toString()}`,
      });
    }

    if (!unlimitedMonitoringLicense) {
      const validLicence = await this.licensekeyService.findUnlimitedMonitoringLicenseForUser(
        user.sub,
      );
      if (!validLicence) {
        return Promise.reject({
          status: 422,
          message: 'There is no valid license found for this action.',
        });
      }
      unlimitedMonitoringLicense = validLicence.key;
    }
    var aimSaveDataResult = {
      insertedResult: {},
      radiosAlreadyMonitorsCount: 0,
      radiosToMonitorCount: 0,
    };
    var afemSaveDataResult = {
      insertedResult: {},
      radiosAlreadyMonitorsCount: 0,
      radiosToMonitorCount: 0,
    };
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
        aimSaveDataResult.radiosAlreadyMonitorsCount =
          radiosAlreadyMonitors.length;
        console.log(
          'radiosAlreadyMonitors AIM',
          aimSaveDataResult.radiosAlreadyMonitorsCount,
        );
        const radiosToMonitor = await this.radiostationService.radioStationModel.find(
          {
            'monitorGroups.name': group,
            _id: { $nin: radiosAlreadyMonitors },
          },
        );
        aimSaveDataResult.radiosToMonitorCount = radiosToMonitor.length;
        console.log(
          'radiosToMonitor AIM',
          aimSaveDataResult.radiosToMonitorCount,
        );
        if (radiosToMonitor.length > 0) {
          const radioMonitors = radiosToMonitor.map(rd => {
            return {
              radio: rd._id,
              owner: user.sub,
              license: unlimitedMonitoringLicense,
              radioSearch: rd,
              isListeningStarted: true,
              startedAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          });
          aimSaveDataResult.insertedResult = await this.subscribeRadioToMonitorBulkWithInsertManyOperation(
            radioMonitors,
            user.sub,
            unlimitedMonitoringLicense,
          );
        }
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
        afemSaveDataResult.radiosAlreadyMonitorsCount =
          radiosAlreadyMonitors.length;
        console.log(
          'radiosAlreadyMonitors AFEM',
          afemSaveDataResult.radiosAlreadyMonitorsCount,
        );
        const radiosToMonitor = await this.radiostationService.radioStationModel.find(
          {
            'monitorGroups.name': group,
            _id: { $nin: radiosAlreadyMonitors },
          },
        );
        afemSaveDataResult.radiosToMonitorCount = radiosToMonitor.length;
        console.log(
          'radiosToMonitor AFEM',
          afemSaveDataResult.radiosToMonitorCount,
        );
        if (radiosToMonitor.length > 0) {
          const radioMonitors = radiosToMonitor.map(rd => {
            return {
              radio: rd._id,
              owner: user.sub,
              license: unlimitedMonitoringLicense,
              radioSearch: rd,
              isListeningStarted: true,
              startedAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          });

          afemSaveDataResult.insertedResult = await this.subscribeRadioToMonitorBulkWithInsertManyOperation(
            radioMonitors,
            user.sub,
            unlimitedMonitoringLicense,
          );
        }
      }
    }

    return {
      aimSaveDataResult: aimSaveDataResult,
      afemSaveDataResult: afemSaveDataResult,
    };
  }
}
