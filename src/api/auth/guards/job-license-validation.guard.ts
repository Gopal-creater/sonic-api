import { CanActivate, ExecutionContext, Injectable, UnprocessableEntityException, BadRequestException } from '@nestjs/common';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { CreateJobDto } from '../../job/dto/create-job.dto';
/**
 * This Guard is responsible for checking valid license with max usages for creating job.
 */

@Injectable()
export class JobLicenseValidationGuard implements CanActivate {
  constructor(private readonly keygenService: KeygenService) {}
  async canActivate(
    context: ExecutionContext,
    
  ){
    const request = context.switchToHttp().getRequest();
    const body = request.body as CreateJobDto
    if(!body.licenseId){
      throw new BadRequestException({
        message:"licenseId must be present."
      })
    }
    const { meta, data, errors } = await this.keygenService.validateLicence(body.licenseId);
    if (errors || !meta['valid']) {
      throw new BadRequestException({
            message:"Invalid license."
          })
    }
    const uses = data['attributes']['uses'];
    const maxUses = data['attributes']['maxUses'];
    if ((maxUses-uses)<body.jobDetails.length) {
      throw new UnprocessableEntityException({
        message:"Lack of usages.",
        remainingUsages:maxUses-uses
      })
    }
    return true;
  }
}


