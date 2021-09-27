import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { CreateJobDto } from '../../job/dto/create-job.dto';
import { LicensekeyService } from '../services/licensekey.service';
/**
 * This Guard is responsible for checking valid license with max usages for creating job.
 */

@Injectable()
export class JobLicenseValidationGuard implements CanActivate {
  constructor(
    private readonly licensekeyService: LicensekeyService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const body = request.body as CreateJobDto;
    if (!body.license || !body.owner || !body.jobFiles) {
      throw new BadRequestException({
        message: 'missing parameters',
      });
    }
    if (body.jobFiles.length < 0) {
      throw new BadRequestException({
        message: 'Please add some files to create job',
      });
    }
    const { validationResult,licenseKey } = await this.licensekeyService.validateLicence(
      body.license,
    );
    if (!validationResult.valid) {
      throw new BadRequestException({
        message: 'Invalid license.',
      });
    }
    if(licenseKey.isUnlimitedEncode){
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
