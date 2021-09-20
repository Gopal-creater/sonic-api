import { CanActivate, ExecutionContext, Injectable, UnprocessableEntityException, BadRequestException } from '@nestjs/common';
import { LicenseKey } from 'src/api/licensekey/schemas/licensekey.schema';
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
      throw new UnprocessableEntityException("No License keys present. Please add a license key to subscribe for encode.")
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
      throw new UnprocessableEntityException({message:validationResult.message})
    }
    if(licenseKey.isUnlimitedEncode){
      return true;
    }
    var reservedLicenceCount = 0;
    if (licenseKey.reserves && Array.isArray(licenseKey.reserves)) {
      reservedLicenceCount = licenseKey.reserves.reduce(
        (sum, { count }) => sum + count,
        0,
      );
    }
    const uses = licenseKey.encodeUses
    const maxUses = licenseKey.maxEncodeUses
    const remainingUses = maxUses-uses
    const remaniningUsesAfterReservedCount = remainingUses - reservedLicenceCount;
    const usesToBeUsed = 1 //One at a time currently
    if (remaniningUsesAfterReservedCount < usesToBeUsed) {
      throw new UnprocessableEntityException({
        message:
          'Error deuto your maximum license usage count exceeded.',
        remainingUsages: remainingUses,
        reservedLicenceCount: reservedLicenceCount,
        remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
        usesToBeUsed: usesToBeUsed,
      });
    }
    return true;
    
  }
}


@Injectable()
export class SubscribeRadioMonitorLicenseValidationGuard implements CanActivate {
  constructor(private readonly licensekeyService: LicensekeyService,) {}
  async canActivate(
    context: ExecutionContext,
  ){
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserSession;
    const data= await this.licensekeyService.licenseKeyModel.find({"owners.ownerId":user.sub})
    if(!data || data.length<=0){
      throw new UnprocessableEntityException("No License keys present. Please add a license key to subscribe for monitor.")
    }
    let currentValidLicense:LicenseKey
    for (let index = 0; index < data.length; index++) {
      const license = data[index];
      if(await this.isValidLicenseForMonitor(license.key,request.body)){
        currentValidLicense=license
        break;
      }
    }
    request.validLicense = currentValidLicense
    return Boolean(currentValidLicense)
  }

  async isValidLicenseForMonitor(id: string,body:any){
    const { validationResult,licenseKey } = await this.licensekeyService.validateLicence(id);
    if (!validationResult.valid) {
      throw new UnprocessableEntityException({message:validationResult.message})
    }
    if(licenseKey.isUnlimitedMonitor){
      return true;
    }
    const uses = licenseKey.monitoringUses
    const maxUses = licenseKey.maxMonitoringUses
    const remainingUses = maxUses-uses
    const usesToBeUsed = Array.isArray(body) ? body.length:1
    if (remainingUses < usesToBeUsed) {
      throw new UnprocessableEntityException({
        message:
          'Error deuto your maximum license usage count exceeded.',
        remainingUsages: remainingUses,
        usesToBeUsed: usesToBeUsed,
      });
    }
    return true;
    
  }
}


