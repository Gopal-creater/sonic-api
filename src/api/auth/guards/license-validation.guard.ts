import { CanActivate, ExecutionContext, Injectable, UnprocessableEntityException, BadRequestException } from '@nestjs/common';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
/**
 * This Guard is responsible for checking valid license from user and add the validLicense field to the request object
 * to make use in some other middleware functions/FilesInterceptor. we can get the value from request as follows
 * Eg: const validLicense = req.validLicense
 */

@Injectable()
export class LicenseValidationGuard implements CanActivate {
  constructor(private readonly keygenService: KeygenService) {}
  async canActivate(
    context: ExecutionContext,
  ){
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const {data,errors}= await this.keygenService.getAllLicenses(`metadata[ownerId]=${user?.sub}`)
    if(!data || data.length<0){
      throw new UnprocessableEntityException("No License keys present. Please add a License key.")
    }
    if(errors){
      throw new BadRequestException("Keygen server error")
    }
    let currentValidLicense
    for (let index = 0; index < data.length; index++) {
      const license = data[index];
      if(await this.isValidLicense(license.id)){
        currentValidLicense=license
        break;
      }
    }
    request.validLicense = currentValidLicense
    return Boolean(currentValidLicense)
  }

  async isValidLicense(id: string){
    const { meta, data, errors } = await this.keygenService.validateLicence(id);
    if (errors || !meta['valid']) {
      return false;
    }
    const uses = data['attributes']['uses'];
    const maxUses = data['attributes']['maxUses'];
    if (uses > maxUses) {
      return false;
    }
    return true;
    
  }
}


