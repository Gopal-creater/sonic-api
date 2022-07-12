import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { RadioMonitor } from './schemas/radiomonitor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, AnyObject, FilterQuery, Model } from 'mongoose';
import { RadiostationService } from '../radiostation/services/radiostation.service';
import { CreateRadioMonitorDto } from './dto/create-radiomonitor.dto';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateRadioMonitorDto } from './dto/mongoosepaginate-radiomonitordto';
import { UserService } from '../user/services/user.service';

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

  async create(doc: AnyObject | AnyKeys<RadioMonitor>) {
    return this.radioMonitorModel
      .create({ ...doc })
      .then(created => {
        return created.save();
      });
  }

  async findAll(
    queryDto: ParsedQueryDto,
  ): Promise<MongoosePaginateRadioMonitorDto> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          createdAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'RadioStation',
          localField: 'radio',
          foreignField: '_id',
          as: 'radio',
        },
      },
      { $addFields: { radio: { $first: '$radio' } } },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'Company',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $addFields: { company: { $first: '$company' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'Partner',
          localField: 'partner',
          foreignField: '_id',
          as: 'partner',
        },
      },
      { $addFields: { partner: { $first: '$partner' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
    ];
    const aggregate = this.radioMonitorModel.aggregate(aggregateArray);
    return this.radioMonitorModel['aggregatePaginate'](aggregate, paginateOptions);
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter } = queryDto;
    return this.radioMonitorModel
      .find(filter || {})
      .countDocuments()
      .exec();
  }

  async getEstimateCount() {
    return this.radioMonitorModel.estimatedDocumentCount();
  }

  async subscribeRadioToMonitor(radio:string,license:string,doc: AnyObject | AnyKeys<RadioMonitor>) {
    const isValidRadioStation = await this.radiostationService.radioStationModel.findById(
      radio,
    );
    if (!isValidRadioStation) {
      return Promise.reject({
        status: 404,
        message: 'Radiostation not found',
      });
    }
    const newMonitor = await this.radioMonitorModel.create({
      radioSearch: isValidRadioStation,
      ...doc,
      radio: radio,
      license:license
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

  findOne(filter: FilterQuery<RadioMonitor>) {
    return this.radioMonitorModel.findOne(filter);
  }

  findById(id: string) {
    return this.radioMonitorModel.findById(id);
  }

  async unsubscribeMonitor(id: string) {
    const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
    if (!isValidRadioMonitor) {
      return Promise.reject({
        status: 404,
        message: 'Not found',
      });
    }
    return this.radioMonitorModel.findByIdAndRemove(id);
  }

}
