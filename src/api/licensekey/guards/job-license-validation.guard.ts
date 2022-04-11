import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { ApiKey } from 'src/api/api-key/schemas/api-key.schema';
import { EncodeFromQueueDto } from 'src/api/sonickey/dtos/encode.dto';
import { ApiKeyType } from 'src/constants/Enums';
import { CreateJobDto } from '../../job/dto/create-job.dto';
import { LicensekeyService } from '../services/licensekey.service';
/**
 * This Guard is responsible for checking valid license with max usages for creating job.
 */

@Injectable()
export class JobLicenseValidationGuard implements CanActivate {
  constructor(private readonly licensekeyService: LicensekeyService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const body = request.body as CreateJobDto;
    const owner = body.owner || request?.user?.['sub'];
    if (!body.license || !owner || !body.jobFiles) {
      throw new BadRequestException({
        message: 'missing parameters',
      });
    }
    if (body.jobFiles.length < 0) {
      throw new BadRequestException({
        message: 'Please add some files to create job',
      });
    }
    const {
      validationResult,
      licenseKey,
    } = await this.licensekeyService.validateLicence(body.license);
    if (!validationResult.valid) {
      throw new BadRequestException({
        message: 'Invalid license.',
      });
    }
    if (licenseKey.isUnlimitedEncode) {
      request.validLicense = licenseKey;
      return true;
    }
    const uses = licenseKey.encodeUses;
    const maxUses = licenseKey.maxEncodeUses;
    const remaniningUses = maxUses - uses;
    const usesToBeUsed = body.jobFiles.length;

    const reserves = licenseKey.reserves || [];
    if (
      await this.isAllowedForJobCreation(remaniningUses, usesToBeUsed, reserves)
    ) {
      request.validLicense = licenseKey;
      return true;
    } else {
      return false;
    }

    // if (remaniningUses<usesToBeUsed) {
    //   throw new UnprocessableEntityException({
    //     message:'Please create a job with minimum files as your maximum license usage count exceeded your file count.',
    //     remainingUsages:remaniningUses
    //   })
    // }
    // return true;
  }

  async isAllowedForJobCreation(
    remaniningUses: number,
    usesToBeUsed: number,
    reserves?: { jobId: string; count: number }[],
  ) {
    var reservedLicenceCount = 0;
    if (reserves && Array.isArray(reserves)) {
      reservedLicenceCount = reserves.reduce(
        (sum, { count }) => sum + count,
        0,
      );
    }
    const remaniningUsesAfterReservedCount =
      remaniningUses - reservedLicenceCount;
    if (remaniningUsesAfterReservedCount < usesToBeUsed) {
      throw new UnprocessableEntityException({
        message:
          'Please create a job with minimum files as your maximum license usage count exceeded your file count.',
        remainingUsages: remaniningUses,
        reservedLicenceCount: reservedLicenceCount,
        remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
        usesToBeUsed: usesToBeUsed,
      });
    }
    return true;
  }
}

@Injectable()
export class BulkEncodeWithQueueLicenseValidationGuard implements CanActivate {
  constructor(private readonly licensekeyService: LicensekeyService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const body = request.body as EncodeFromQueueDto;
    const companyId = request?.params?.companyId;
    const apikey = request?.['apikey'] as ApiKey
    if(apikey.type!==ApiKeyType.COMPANY){
      throw new BadRequestException({
        message: 'Given apikey is not a company type apikey, you must used company apikey here.',
      });
    }
    if(apikey?.company?._id!==companyId){
      throw new BadRequestException({
        message: 'Given apikey is not own by given company, please use your own apikey',
      });
    }
    console.log('companyId', companyId);
    if (body.fileSpecs?.length < 0) {
      throw new BadRequestException({
        message: 'Please add at least one fileSpecs to create queue',
      });
    }
    const {
      validationResult,
      licenseKey,
    } = await this.licensekeyService.validateLicence(body.license);
    if (!validationResult.valid) {
      throw new BadRequestException({
        message: 'Invalid license.',
      });
    }
    if (!licenseKey.company) {
      throw new BadRequestException({
        message: 'Given license is not a company type license, you must used company license here.',
      });
    }
    if (companyId !== licenseKey.company?._id) {
      throw new BadRequestException({
        message: 'Given license is not own by given company, please use your own license',
      });
    }
    if (licenseKey.isUnlimitedEncode) {
      request.validLicense = licenseKey;
      return true;
    }
    const uses = licenseKey.encodeUses;
    const maxUses = licenseKey.maxEncodeUses;
    const remaniningUses = maxUses - uses;
    const usesToBeUsed = body.fileSpecs.length;

    const reserves = licenseKey.reserves || [];
    if (
      await this.isAllowedForJobCreation(remaniningUses, usesToBeUsed, reserves)
    ) {
      request.validLicense = licenseKey;
      return true;
    } else {
      return false;
    }
  }

  async isAllowedForJobCreation(
    remaniningUses: number,
    usesToBeUsed: number,
    reserves?: { jobId: string; count: number }[],
  ) {
    var reservedLicenceCount = 0;
    if (reserves && Array.isArray(reserves)) {
      reservedLicenceCount = reserves.reduce(
        (sum, { count }) => sum + count,
        0,
      );
    }
    const remaniningUsesAfterReservedCount =
      remaniningUses - reservedLicenceCount;
    if (remaniningUsesAfterReservedCount < usesToBeUsed) {
      throw new UnprocessableEntityException({
        message:
          'Please create a job with minimum files as your maximum license usage count exceeded your file count.',
        remainingUsages: remaniningUses,
        reservedLicenceCount: reservedLicenceCount,
        remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
        usesToBeUsed: usesToBeUsed,
      });
    }
    return true;
  }
}
