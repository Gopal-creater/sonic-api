import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSonicKeyFromBinaryDto } from '../../sonickey/dtos/create-sonickey.dto';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';

/**
 * This Guard is responsible for checking valid license with max usages for creating job.
 */

@Injectable()
export class BinaryLicenseValidationGuard implements CanActivate {
  constructor(
    private readonly licensekeyService: LicensekeyService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const body = request.body as CreateSonicKeyFromBinaryDto;
    if (!body.license || !body.sonicKey) {
      throw new BadRequestException({
        message: 'missing parameters',
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

    const reserves = licenseKey.reserves || [];
    if (await this.isAllowedForJobCreation(remaniningUses, reserves)) {
      request.validLicense = licenseKey;
      return true;
    } else {
      return false;
    }
  }

  async isAllowedForJobCreation(
    remaniningUses: number,
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
    if (remaniningUsesAfterReservedCount <= 0) {
      throw new UnprocessableEntityException({
        message: 'Maximum license usage count exceeded.',
        remainingUsages: remaniningUses,
        reservedLicenceCount: reservedLicenceCount,
        remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
      });
    }
    return true;
  }
}
