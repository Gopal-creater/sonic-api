import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { JSONUtils } from '../../../shared/utils';
import { CreateSonicKeyFromBinaryDto } from '../../sonickey/dtos/create-sonickey.dto';
/**
 * This Guard is responsible for checking valid license with max usages for creating job.
 */

@Injectable()
export class BinaryLicenseValidationGuard implements CanActivate {
  constructor(private readonly keygenService: KeygenService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const body = request.body as CreateSonicKeyFromBinaryDto;
    if (!body.license || !body.sonicKey) {
      throw new BadRequestException({
        message: 'missing parameters',
      });
    }
    const { meta, data, errors } = await this.keygenService.validateLicence(
      body.license,
    );
    if (errors || !meta['valid']) {
      throw new BadRequestException({
        message: 'Invalid license.',
      });
    }
    const uses = data['attributes']['uses'];
    const maxUses = data['attributes']['maxUses'];
    const remaniningUses = maxUses - uses;

    const reserves = JSONUtils.parse(data?.attributes?.metadata?.reserves,[]) as {
      jobId: string;
      count: number;
    }[]
    if (
      await this.isAllowedForJobCreation(remaniningUses, reserves)
    ) {
      request.validLicense = data;
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
        message:
          'Maximum license usage count exceeded.',
        remainingUsages: remaniningUses,
        reservedLicenceCount: reservedLicenceCount,
        remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount
      });
    }
    return true;
  }
}
