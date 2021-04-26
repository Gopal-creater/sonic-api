import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { CreateJobDto } from '../../job/dto/create-job.dto';
import { JSONUtils } from '../../../shared/utils';
/**
 * This Guard is responsible for checking valid license with max usages for creating job.
 */

@Injectable()
export class JobLicenseValidationGuard implements CanActivate {
  constructor(private readonly keygenService: KeygenService) {}
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
    const { meta, data, errors } = await this.keygenService.validateLicence(
      body.license,
    );
    if (errors || !meta['valid']) {
      throw new BadRequestException({
        message: 'Invalid license.',
      });
    }
    if (data?.attributes?.metadata?.ownerId !== body.owner) {
      throw new BadRequestException({
        message: 'Looks like the provided licence id is not belongs to you.',
      });
    }
    const uses = data['attributes']['uses'];
    const maxUses = data['attributes']['maxUses'];
    const remaniningUses = maxUses - uses;
    const usesToBeUsed = body.jobFiles.length;

    const reserves = JSONUtils.parse(data?.attributes?.metadata?.reserves,[]) as {
      jobId: string;
      count: number;
    }[]
    if (
      await this.isAllowedForJobCreation(remaniningUses, usesToBeUsed, reserves)
    ) {
      request.validLicense = data;
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
