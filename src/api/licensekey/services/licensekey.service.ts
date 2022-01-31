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

type usesFor = 'encode' | 'decode' | 'monitor';

@Injectable()
export class LicensekeyService {
  constructor(
    @InjectModel(LicenseKey.name)
    public readonly licenseKeyModel: Model<LicenseKey>,
    public readonly keygenService: KeygenService,
    public readonly companyService: CompanyService,

    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
  ) {}

async create(createLicensekeyDto: CreateLicensekeyDto, createdBy: string) {
    const key = uuidv4();
    const newLicenseKey = new this.licenseKeyModel({
      ...createLicensekeyDto,
      _id: key,
      key: key,
      createdBy: createdBy,
    });
    return newLicenseKey.save();
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
      'owners.ownerId': userId,
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
      'owners.ownerId': userId,
      disabled: false,
      suspended: false,
      validity: { $gte: startOfToday },
      $or: [{ isUnlimitedMonitor: true }, { maxMonitoringUses: { $gt: 0 } }],
    });
    return validLicenseForMonitor;
  }

  async findValidLicesesForUser(user: string, filter?: FilterQuery<LicenseKey>) {
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
            ...filter,
          },
        },
        {
          $lookup: {
            //populate radioStation from its relational table
            from: 'User',
            localField: 'owners.ownerId',
            foreignField: '_id',
            as: 'owners.ownerId',
          },
        },
        { $addFields: { 'owners.ownerId': { $first: '$owners.ownerId' } } },
        {
          $match: {
            'owners.ownerId.companies': { $in: userFromDb.companies },
          },
        },
      ],
    );
    if (validLicenseForUserWithInCompany.length > 0) {
      validLicenses = validLicenseForUserWithInCompany;
    } else {
      var validLicenseForUser = await this.licenseKeyModel.find({
        disabled: false,
        suspended: false,
        validity: { $gte: startOfToday },
        'owners.ownerId': user,
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
        $match: {
          ...relationalFilter,
        },
      },
    ]);
    return await this.licenseKeyModel['aggregatePaginate'](
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

  async addOwnersToLicense(id: string, owners: LKOwner[]) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    licenseKey.owners.push(...owners);
    licenseKey.owners = _.uniqBy(licenseKey.owners, 'ownerId');
    return licenseKey.save();
  }

  async addOwnerToLicense(id: string, lKOwner: LKOwner) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    licenseKey.owners.push(lKOwner);
    licenseKey.owners = _.uniqBy(licenseKey.owners, 'ownerId');
    return licenseKey.save();
  }

  async removeOwnerFromLicense(id: string, ownerId: string) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    licenseKey.owners = licenseKey.owners.filter(ow => ow.ownerId !== ownerId);
    return licenseKey.save();
  }

  async removeOwnersFromLicense(id: string, ownerIds: string[]) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    var oldOwners = licenseKey.owners;
    for (let index = 0; index < ownerIds.length; index++) {
      const owner = ownerIds[index];
      _.remove(oldOwners, ow => ow.ownerId == owner);
    }
    licenseKey.owners = oldOwners;
    return licenseKey.save();
  }

  async incrementUses(id: string, usesFor: usesFor, incrementBy: number = 1) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) throw new NotFoundException();
    if (usesFor == 'decode') {
      if (!licenseKey.isUnlimitedDecode) {
        licenseKey.decodeUses = licenseKey.decodeUses + incrementBy;
        if (licenseKey.decodeUses > licenseKey.maxDecodeUses) {
          throw new UnprocessableEntityException(
            "Can't increment uses because this increment will exceed the maxUses.",
          );
        }
      }
    } else if (usesFor == 'encode') {
      if (!licenseKey.isUnlimitedEncode) {
        licenseKey.encodeUses = licenseKey.encodeUses + incrementBy;
        if (licenseKey.encodeUses > licenseKey.maxEncodeUses) {
          throw new UnprocessableEntityException(
            "Can't increment uses because this increment will exceed the maxUses.",
          );
        }
      }
    } else if (usesFor == 'monitor') {
      if (!licenseKey.isUnlimitedMonitor) {
        licenseKey.monitoringUses = licenseKey.monitoringUses + incrementBy;
        if (licenseKey.monitoringUses > licenseKey.maxMonitoringUses) {
          throw new UnprocessableEntityException(
            "Can't increment uses because this increment will exceed the maxUses for monitor.",
          );
        }
      }
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

  async decrementUses(id: string, usesFor: usesFor, decrementBy: number = 1) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) throw new NotFoundException();
    if (usesFor == 'decode') {
      if (!licenseKey.isUnlimitedDecode) {
        licenseKey.decodeUses = licenseKey.decodeUses - decrementBy;
        if (licenseKey.decodeUses < 0) {
          throw new UnprocessableEntityException(
            "Can't decrement uses because this decrement will become less than 0.",
          );
        }
      }
    } else if (usesFor == 'encode') {
      if (!licenseKey.isUnlimitedEncode) {
        licenseKey.encodeUses = licenseKey.encodeUses - decrementBy;
        if (licenseKey.encodeUses < 0) {
          throw new UnprocessableEntityException(
            "Can't decrement uses because this decrement will become less than 0.",
          );
        }
      }
    } else if (usesFor == 'monitor') {
      if (!licenseKey.isUnlimitedMonitor) {
        licenseKey.monitoringUses = licenseKey.monitoringUses - decrementBy;
        if (licenseKey.monitoringUses < 0) {
          throw new UnprocessableEntityException(
            "Can't decrement uses because this decrement will become less than 0 for monitor.",
          );
        }
      }
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

  async migrateKeyFromKeygenToDB() {
    const { data, error } = await this.keygenService.getAllLicenses('limit=90');
    for await (const license of data) {
      const oldLicense = license?.attributes;
      const { reserves, ...oldOwners } = oldLicense?.metadata || {};
      console.log('Name', oldLicense?.name);
      const oldOwnersArr = Object.values(oldOwners || {}) as string[];
      console.log('oldOwners', oldOwnersArr);
      var newOwners: LKOwner[] = [];
      for await (const ownerId of oldOwnersArr) {
        const user = await this.userService.getUserProfile(ownerId);
        if (user) {
          const lkOwner = new LKOwner();
          lkOwner.ownerId = ownerId;
          lkOwner.username = user.username;
          lkOwner.email = user.email;
          lkOwner.name = user.username;
          newOwners.push(lkOwner);
        }
      }
      newOwners = _.uniqBy(newOwners, 'ownerId');

      console.log('newOwners', newOwners);
      const newLicense = new this.licenseKeyModel({
        _id: license.id,
        key: license.id,
        name: oldLicense.name,
        disabled: false,
        suspended: oldLicense.suspended,
        maxEncodeUses: oldLicense.maxUses,
        encodeUses: oldLicense.uses,
        maxDecodeUses: 0,
        decodeUses: 0,
        validity: oldLicense.expiry,
        createdBy:
          process.env.NODE_ENV == 'production'
            ? '9ab5a58b-09e0-46ce-bb50-1321d927c382'
            : '5728f50d-146b-47d2-aa7b-a50bc37d641d',
        owners: newOwners,
      });

      await newLicense.save().catch(err => {
        console.log(`Error saving license ${oldLicense.name}`, err);
      });
    }
    return data.length || 0;
  }
}
