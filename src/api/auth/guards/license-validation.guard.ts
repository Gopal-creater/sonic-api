import { CanActivate, ExecutionContext, Injectable, UnprocessableEntityException, BadRequestException } from '@nestjs/common';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { UserSession } from '../../user/schemas/user.schema';

/**
 * This Guard is responsible for checking valid license from user and add the validLicense field to the request object
 * to make use in some other middleware functions/FilesInterceptor. we can get the value from request as follows
 * Eg: const validLicense = req.validLicense
 */

@Injectable()
export class LicenseValidationGuard implements CanActivate {
  constructor(private readonly licensekeyService: LicensekeyService,) {}
  async canActivate(
    context: ExecutionContext,
  ){
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserSession;
    const ownerKey =`owner${user?.sub}`.replace(/-/g,'')
    const data= await this.licensekeyService.licenseKeyModel.find({"owners.ownerId":user.sub})
    if(!data || data.length<=0){
      throw new UnprocessableEntityException("No License keys present. Please add a License key.")
    }
    let currentValidLicense
    for (let index = 0; index < data.length; index++) {
      const license = data[index];
      if(await this.isValidLicense(license.key)){
        currentValidLicense=license
        break;
      }
    }
    request.validLicense = currentValidLicense
    return Boolean(currentValidLicense)
  }

  async isValidLicense(id: string){
    const { validationResult,licenseKey } = await this.licensekeyService.validateLicence(id);
    if (!validationResult.valid) {
      return false;
    }
    const uses = licenseKey.encodeUses
    const maxUses = licenseKey.maxEncodeUses
    if (uses > maxUses) {
      return false;
    }
    return true;
    
  }
}


