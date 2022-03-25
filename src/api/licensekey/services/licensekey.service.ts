import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateLicensekeyDto } from '../dto/create-licensekey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LicenseKey, LKOwner, LKReserve } from '../schemas/licensekey.schema';
import { Model, FilterQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { MongoosePaginateLicensekeyDto } from '../dto/mongoosepaginate-licensekey.dto';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { UserService } from '../../user/services/user.service';
import { UserDB } from '../../user/schemas/user.db.schema';
import { CompanyService } from '../../company/company.service';
import { PlanService } from '../../plan/plan.service';
import { PlanType, ApiKeyType } from 'src/constants/Enums';

type usesFor = 'encode' | 'decode' | 'monitor';

@Injectable()
export class LicensekeyService {
  constructor(
    @InjectModel(LicenseKey.name)
    public readonly licenseKeyModel: Model<LicenseKey>,
    public readonly keygenService: KeygenService,
    public readonly companyService: CompanyService,
    @Inject(forwardRef(() => PlanService))
    public readonly planService: PlanService,

    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
  ) {}

  async create(createLicensekeyDto: CreateLicensekeyDto, createdBy: string) {
    const { user, ...dtos } = createLicensekeyDto;
    const key = uuidv4();
    const newLicenseKey = await this.licenseKeyModel.create({
      ...dtos,
      users: [user],
      _id: key,
      key: key,
      createdBy: createdBy,
    });
    return newLicenseKey.save();
  }

  async createLicenseFromPlanAndAssignToUser(user:string,plan: string) {
    const key = uuidv4();
    const planFromDb = await this.planService.findById(plan);
    const validity = new Date(new Date().setFullYear(new Date().getFullYear() + 90))
    var newLicense:LicenseKey
    if(planFromDb.type==PlanType.ENCODE){
      newLicense = await this.licenseKeyModel.create({
        users: [user],
        maxEncodeUses:planFromDb.availableSonicKeys,
        maxDecodeUses:0,
        maxMonitoringUses:0,
        validity:validity,
        type:ApiKeyType.INDIVIDUAL,
        activePlan:plan,
        planType:planFromDb.type,
        logs:["Created from plan selection"],
        _id: key,
        name:`${planFromDb.type}_${Date.now()}`,
        key: key,
        createdBy: user,
      });
    }
    return newLicense.save();
  }

  async upgradeLicenseFromPlanAndAssignToUser(licenseKey:string,user:string,plan: string) {
    const planFromDb = await this.planService.findById(plan);
    var keyFromDb = await this.findOne({key:licenseKey,users:user})
    if(planFromDb.type==PlanType.ENCODE){
      keyFromDb.maxEncodeUses=keyFromDb.maxEncodeUses+planFromDb.availableSonicKeys
      keyFromDb.previousPlan=keyFromDb?.activePlan?._id
      keyFromDb.activePlan=plan
      keyFromDb.logs.push(`Upgraded from ${keyFromDb?.activePlan?.name}(${PlanType.ENCODE}) to ${planFromDb?.name}(${PlanType.ENCODE})`)
    }
    return keyFromDb.save();
  }

  async addExtraUsesToLicenseFromPlanAndAssignToUser(licenseKey:string,user:string,extraUses:number) {
    var keyFromDb = await this.findOne({key:licenseKey,users:user})
    if(keyFromDb?.activePlan?.type==PlanType.ENCODE){
      keyFromDb.maxEncodeUses=keyFromDb.maxEncodeUses+extraUses
      keyFromDb.logs.push(`Added ${extraUses} extra sonickeys`)
    }
    return keyFromDb.save();
  }

  /**
   * This will give them unlimited encodes and Monitoring for 7 months.
   * @returns
   */
  createUnlimitedMonitoringLicense() {
    const key = uuidv4();
    const newLicenseKey = new this.licenseKeyModel({
      _id: key,
      key: key,
      name: `7 Month Unlimited Monitoring_${Date.now()}`,
      isUnlimitedMonitor: true,
      validity: new Date(new Date().setMonth(new Date().getMonth() + 7)),
      createdBy: 'system_generate',
    });
    return newLicenseKey.save();
  }

  /**
   * This will give them unlimited encodes and Monitoring for 7 months.
   * @returns
   */
  createDefaultLicenseToAssignUser() {
    const key = uuidv4();
    const newLicenseKey = new this.licenseKeyModel({
      _id: key,
      key: key,
      name: `7 Month Unlimited Monitoring & Encode_${Date.now()}`,
      isUnlimitedMonitor: true,
      isUnlimitedEncode: true,
      validity: new Date(new Date().setMonth(new Date().getMonth() + 7)),
      createdBy: 'system_generate',
    });
    return newLicenseKey.save();
  }

  async findOrCreateUnlimitedMonitoringLicense() {
    var now = new Date();
    var startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    var license = await this.licenseKeyModel.findOne({
      $or: [{ createdBy: 'system_generate' }, { createdBy: 'auto_generate' }],
      isUnlimitedMonitor: true,
      disabled: false,
      suspended: false,
      validity: { $gte: startOfToday },
    });
    if (!license) {
      license = await this.createUnlimitedMonitoringLicense();
    }
    return license;
  }

  async findOrCreateDefaultLicenseToAssignUser() {
    var now = new Date();
    var startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    var license = await this.licenseKeyModel.findOne({
      $or: [{ createdBy: 'system_generate' }, { createdBy: 'auto_generate' }],
      isUnlimitedMonitor: true,
      isUnlimitedEncode: true,
      disabled: false,
      suspended: false,
      validity: { $gte: startOfToday },
    });
    if (!license) {
      license = await this.createDefaultLicenseToAssignUser();
    }
    return license;
  }

  async findUnlimitedMonitoringLicenseForUser(userId: string) {
    var now = new Date();
    var startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    var license = await this.licenseKeyModel.findOne({
      users: userId,
      disabled: false,
      suspended: false,
      validity: { $gte: startOfToday },
      $or: [
        { isUnlimitedMonitor: true },
        { createdBy: 'system_generate' },
        { createdBy: 'auto_generate' },
      ],
    });
    return license;
  }

  async findPreferedLicenseToGetRadioMonitoringListFor(userId: string) {
    var now = new Date();
    var startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    var validLicenseForMonitor = await this.licenseKeyModel.findOne({
      users: userId,
      disabled: false,
      suspended: false,
      validity: { $gte: startOfToday },
      $or: [{ isUnlimitedMonitor: true }, { maxMonitoringUses: { $gt: 0 } }],
    });
    return validLicenseForMonitor;
  }

  async findValidLicesesForUser(
    user: string,
    filter?: FilterQuery<LicenseKey>,
  ) {
    var now = new Date();
    var startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    var validLicenses: LicenseKey[];
    var userFromDb = await this.userService.userModel.findById(user);
    userFromDb = userFromDb.depopulate('companies');

    var validLicenseForUserWithInCompany: LicenseKey[] = await this.licenseKeyModel.aggregate(
      [
        {
          $match: {
            disabled: false,
            suspended: false,
            validity: { $gte: startOfToday },
            company:{$in:userFromDb.companies},
            ...filter,
          },
        }
      ],
    );
    if (validLicenseForUserWithInCompany.length > 0) {
      validLicenses = validLicenseForUserWithInCompany;
    } else {
      var validLicenseForUser = await this.licenseKeyModel.find({
        disabled: false,
        suspended: false,
        validity: { $gte: startOfToday },
        users: user,
        ...filter,
      });
      validLicenses = validLicenseForUser;
    }
    return validLicenses;
  }

  async findAll(
    queryDto: ParsedQueryDto,
  ): Promise<MongoosePaginateLicensekeyDto> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      relationalFilter,
      select,
      populate,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;

    const aggregate = this.licenseKeyModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'users',
          foreignField: '_id',
          as: 'users',
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'Company',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $addFields: { company: { $first: '$company' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
    ]);
    return  this.licenseKeyModel['aggregatePaginate'](
      aggregate,
      paginateOptions,
    );
  }

  async validateLicence(id: string) {
    var validationResult = {
      valid: true,
      message: '',
    };
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) {
      validationResult.valid = false;
      validationResult.message = 'Invalid license key';
    } else if (new Date(licenseKey.validity).getTime() < new Date().getTime()) {
      validationResult.valid = false;
      validationResult.message = 'License key is expired';
    } else if (licenseKey.disabled || licenseKey.suspended) {
      validationResult.valid = false;
      validationResult.message = 'License key is either disabled or suspended';
    }

    return { validationResult, licenseKey };
  }

  async addOwnersToLicense(id: string, users: string[]) {
    return this.licenseKeyModel.findOneAndUpdate(
      { _id: id },
      {
        $addToSet: {
          users: { $each: users },
        },
      },
      {
        new: true,
      },
    );
  }

  async addOwnerToLicense(id: string, user: string) {
    return this.licenseKeyModel.findOneAndUpdate(
      { _id: id },
      {
        $addToSet: {
          users: user,
        },
      },
      {
        new: true,
      },
    );
  }

  async removeOwnerFromLicense(id: string, user: string) {
    return this.licenseKeyModel.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          users: user,
        },
      },
      {
        new: true,
      },
    );
  }

  async removeOwnersFromLicense(id: string, users: string[]) {
    return this.licenseKeyModel.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          users: { $in: users },
        },
      },
      {
        new: true,
      },
    );
  }

  async incrementUses(id: string, usesFor: usesFor, incrementBy: number = 1) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) throw new NotFoundException();
    if (usesFor == 'decode') {
      const decodeUsesWillBe = licenseKey.decodeUses + incrementBy;
      if (!licenseKey.isUnlimitedDecode) {
        if (decodeUsesWillBe > licenseKey.maxDecodeUses) {
          throw new UnprocessableEntityException(
            "Can't increment uses because this increment will exceed the maxUses.",
          );
        }
      }
      licenseKey.decodeUses = decodeUsesWillBe;
    } else if (usesFor == 'encode') {
      const encodeUsesWillBe = licenseKey.encodeUses + incrementBy
      if (!licenseKey.isUnlimitedEncode) {
        if (encodeUsesWillBe > licenseKey.maxEncodeUses) {
          throw new UnprocessableEntityException(
            "Can't increment uses because this increment will exceed the maxUses.",
          );
        }
      }
      licenseKey.encodeUses = encodeUsesWillBe;
    } else if (usesFor == 'monitor') {
      const monitoringUsesWillBe = licenseKey.monitoringUses + incrementBy
      if (!licenseKey.isUnlimitedMonitor) {
        if (monitoringUsesWillBe > licenseKey.maxMonitoringUses) {
          throw new UnprocessableEntityException(
            "Can't increment uses because this increment will exceed the maxUses for monitor.",
          );
        }
      }
      licenseKey.monitoringUses = monitoringUsesWillBe
    }
    return licenseKey.save();
  }

  async allowedForIncrementUses(
    id: string,
    usesFor: usesFor,
    incrementBy: number = 1,
  ) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) return false;
    if (usesFor == 'decode') {
      if (!licenseKey.isUnlimitedDecode) {
        licenseKey.decodeUses = licenseKey.decodeUses + incrementBy;
        if (licenseKey.decodeUses > licenseKey.maxDecodeUses) {
          return false;
        }
      }
    } else if (usesFor == 'encode') {
      if (!licenseKey.isUnlimitedEncode) {
        licenseKey.encodeUses = licenseKey.encodeUses + incrementBy;
        if (licenseKey.encodeUses > licenseKey.maxEncodeUses) {
          return false;
        }
      }
    } else if (usesFor == 'monitor') {
      if (!licenseKey.isUnlimitedMonitor) {
        licenseKey.monitoringUses = licenseKey.monitoringUses + incrementBy;
        if (licenseKey.monitoringUses > licenseKey.maxMonitoringUses) {
          return false;
        }
      }
    }
    return true;
  }

  findOne(filter:FilterQuery<LicenseKey>) {
    return this.licenseKeyModel.findOne(filter);
  }

  async decrementUses(id: string, usesFor: usesFor, decrementBy: number = 1) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) throw new NotFoundException();
    if (usesFor == 'decode') {
      const decodeUsesWillBe = licenseKey.decodeUses - decrementBy;
      if (!licenseKey.isUnlimitedDecode) {
        if (decodeUsesWillBe < 0) {
          throw new UnprocessableEntityException(
            "Can't decrement uses because this decrement will become less than 0.",
          );
        }
      }
      licenseKey.decodeUses = decodeUsesWillBe;
    } else if (usesFor == 'encode') {
      const encodeUsesWillBe = licenseKey.encodeUses - decrementBy
      if (!licenseKey.isUnlimitedEncode) {
        if (encodeUsesWillBe < 0) {
          throw new UnprocessableEntityException(
            "Can't decrement uses because this decrement will become less than 0.",
          );
        }
      }
      licenseKey.encodeUses = encodeUsesWillBe;
    } else if (usesFor == 'monitor') {
      const monitoringUsesWillBe = licenseKey.monitoringUses - decrementBy
      if (!licenseKey.isUnlimitedMonitor) {
        if (monitoringUsesWillBe < 0) {
          throw new UnprocessableEntityException(
            "Can't decrement uses because this decrement will become less than 0 for monitor.",
          );
        }
      }
      licenseKey.monitoringUses = monitoringUsesWillBe;
    }
    return licenseKey.save();
  }

  async allowedForDecrementUses(
    id: string,
    usesFor: usesFor,
    decrementBy: number = 1,
  ) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) return false;
    if (usesFor == 'decode') {
      if (!licenseKey.isUnlimitedDecode) {
        licenseKey.decodeUses = licenseKey.decodeUses - decrementBy;
        if (licenseKey.decodeUses < 0) {
          return false;
        }
      }
    } else if (usesFor == 'encode') {
      if (!licenseKey.isUnlimitedEncode) {
        licenseKey.encodeUses = licenseKey.encodeUses - decrementBy;
        if (licenseKey.encodeUses < 0) {
          return false;
        }
      }
    } else if (usesFor == 'monitor') {
      if (!licenseKey.isUnlimitedMonitor) {
        licenseKey.monitoringUses = licenseKey.monitoringUses - decrementBy;
        if (licenseKey.monitoringUses < 0) {
          return false;
        }
      }
    }
    return true;
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.licenseKeyModel.find(filter || {}).count();
  }

  async getEstimateCount() {
    return this.licenseKeyModel.estimatedDocumentCount();
  }

  async resetUses(id: string, usesFor: usesFor | 'both') {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) throw new NotFoundException();
    if (usesFor == 'decode') {
      licenseKey.decodeUses = 0;
    } else if (usesFor == 'encode') {
      licenseKey.encodeUses = 0;
    } else if (usesFor == 'both') {
      licenseKey.decodeUses = 0;
      licenseKey.encodeUses = 0;
    }
    return licenseKey.save();
  }

  async addReservedDetailsInLicence(licenseId: string, reserves: LKReserve[]) {
    const license = await this.licenseKeyModel.findById(licenseId);
    license.reserves.push(...reserves);
    return license.save();
  }
  async removeReservedDetailsInLicence(licenseId: string, jobId: string) {
    const license = await this.licenseKeyModel.findById(licenseId);
    license.reserves = license.reserves.filter(reser => reser.jobId !== jobId);
    return license.save();
  }

  async incrementReservedDetailsInLicenceBy(
    licenseId: string,
    jobId: string,
    count: number,
  ) {
    const license = await this.licenseKeyModel.findById(licenseId);
    const updatedReserves = license.reserves.map(reserve => {
      if (reserve.jobId == jobId) {
        reserve.count = reserve.count + count;
      }
      return reserve;
    });
    license.reserves = updatedReserves;
    return license.save();
  }

  async decrementReservedDetailsInLicenceBy(
    licenseId: string,
    jobId: string,
    count: number,
  ) {
    const license = await this.licenseKeyModel.findById(licenseId);
    const updatedReserves = license.reserves.map(reserve => {
      if (reserve.jobId == jobId) {
        reserve.count = reserve.count - count;
      }
      return reserve;
    });
    license.reserves = updatedReserves;
    return license.save();
  }
}
