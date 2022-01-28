import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { LicenseKey } from 'src/api/licensekey/schemas/licensekey.schema';
import { LicensekeyService } from '../services/licensekey.service';
import { CognitoUserSession } from '../../user/schemas/user.aws.schema';
import { HttpException } from '@nestjs/common';

/**
 * This Guard is responsible for checking valid license from user and add the validLicense field to the request object
 * to make use in some other middleware functions/FilesInterceptor. we can get the value from request as follows
 * Eg: const validLicense = req.validLicense
 */

@Injectable()
export class LicenseValidationGuard implements CanActivate {
  constructor(private readonly licensekeyService: LicensekeyService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user as CognitoUserSession;
    const licenses = await this.licensekeyService.findValidLicesesForUser(user.sub)
    if (!licenses || licenses.length <= 0) {
      throw new UnprocessableEntityException(
        'No License keys present. Please add a license key to subscribe for encode.',
      );
    }
    var currentValidLicense: LicenseKey;
    var valid: boolean;
    var message: string;
    var remainingUses: number;
    var reservedLicenceCount: number;
    var remaniningUsesAfterReservedCount: number;
    var usesToBeUsed: number;
    var maxEncodeUses: number;
    var statusCode: number;
    for await (const license of licenses) {
      const validationResults = await this.isValidLicenseForEncode(license.key);
      if (validationResults.valid) {
        valid = true;
        currentValidLicense = license;
        break;
      }
      valid = false;
      statusCode = validationResults.statusCode || 422;
      message = validationResults.message || 'License validation failded';
      remainingUses = validationResults.remainingUses;
      reservedLicenceCount = validationResults.reservedLicenceCount;
      remaniningUsesAfterReservedCount =
        validationResults.remaniningUsesAfterReservedCount;
      usesToBeUsed = validationResults.usesToBeUsed;
      maxEncodeUses = validationResults.maxEncodeUses;
    }
    if (!valid) {
      throw new HttpException(
        {
          valid: valid,
          message: message,
          remainingUses: remainingUses,
          reservedLicenceCount: reservedLicenceCount,
          remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
          usesToBeUsed: usesToBeUsed,
          maxEncodeUses: maxEncodeUses,
        },
        statusCode,
      );
    }
    request.validLicense = currentValidLicense;
    return Boolean(currentValidLicense);
  }

  async isValidLicenseForEncode(id: string) {
    const {
      validationResult,
      licenseKey,
    } = await this.licensekeyService.validateLicence(id);
    if (!validationResult.valid) {
      return {
        valid: false,
        message: validationResult.message,
        statusCode: 422,
        usesExceeded: false,
      };
    }
    if (licenseKey.isUnlimitedEncode) {
      return {
        valid: true,
      };
    }
    var reservedLicenceCount = 0;
    if (licenseKey.reserves && Array.isArray(licenseKey.reserves)) {
      reservedLicenceCount = licenseKey.reserves.reduce(
        (sum, { count }) => sum + count,
        0,
      );
    }
    const uses = licenseKey.encodeUses;
    const maxUses = licenseKey.maxEncodeUses;
    const remainingUses = maxUses - uses;
    const remaniningUsesAfterReservedCount =
      remainingUses - reservedLicenceCount;
    const usesToBeUsed = 1; //One at a time currently
    if (remaniningUsesAfterReservedCount < usesToBeUsed) {
      return {
        valid: false,
        message: 'Error deuto your maximum license usage count exceeded.',
        statusCode: 422,
        usesExceeded: true,
        remainingUses: remainingUses,
        reservedLicenceCount: reservedLicenceCount,
        remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
        usesToBeUsed: usesToBeUsed,
        maxEncodeUses: maxUses,
      };
    }
    return {
      valid: true,
    };
  }
}

@Injectable()
export class GetSubscribedRadioMonitorListLicenseValidationGuard
  implements CanActivate {
  constructor(private readonly licensekeyService: LicensekeyService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user as CognitoUserSession;
    const validLicenseForMonitor = await this.licensekeyService.findPreferedLicenseToGetRadioMonitoringListFor(
      user.sub,
    );
    if (!validLicenseForMonitor) {
      throw new UnprocessableEntityException(
        'No valid monitoring license found!',
      );
    }
    request.validLicense = validLicenseForMonitor;
    return Boolean(validLicenseForMonitor);
  }
}

@Injectable()
export class SubscribeRadioMonitorLicenseValidationGuard
  implements CanActivate {
  constructor(private readonly licensekeyService: LicensekeyService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user as CognitoUserSession;
    const licenses = await this.licensekeyService.licenseKeyModel.find({
      'owners.ownerId': user.sub,
    });
    if (!licenses || licenses.length <= 0) {
      throw new UnprocessableEntityException(
        'No License keys present. Please add a license key to subscribe for monitor.',
      );
    }
    var currentValidLicense: LicenseKey;
    var valid: boolean;
    var message: string;
    var remainingUses: number;
    var usesToBeUsed: number;
    var maxMonitoringUses: number;
    var statusCode: number;

    for await (const license of licenses) {
      const validationResults = await this.isValidLicenseForMonitor(
        license.key,
        request.body,
      );
      if (validationResults.valid) {
        valid = true;
        currentValidLicense = license;
        break;
      }
      valid = false;
      statusCode = validationResults.statusCode || 422;
      message = validationResults.message || 'License validation failded';
      remainingUses = validationResults.remainingUses;
      usesToBeUsed = validationResults.usesToBeUsed;
      maxMonitoringUses = validationResults.maxMonitoringUses;
    }
    if (!valid) {
      throw new HttpException(
        {
          valid: valid,
          message: message,
          remainingUses: remainingUses,
          usesToBeUsed: usesToBeUsed,
          maxMonitoringUses: maxMonitoringUses,
        },
        statusCode,
      );
    }
    request.validLicense = currentValidLicense;
    return Boolean(currentValidLicense);
  }

  async isValidLicenseForMonitor(id: string, body: any) {
    const {
      validationResult,
      licenseKey,
    } = await this.licensekeyService.validateLicence(id);
    if (!validationResult.valid) {
      return {
        valid: false,
        message: validationResult.message,
        statusCode: 422,
        usesExceeded: false,
      };
    }
    if (licenseKey.isUnlimitedMonitor) {
      return {
        valid: true,
      };
    }
    const uses = licenseKey.monitoringUses;
    const maxUses = licenseKey.maxMonitoringUses;
    const remainingUses = maxUses - uses;
    const usesToBeUsed = Array.isArray(body) ? body.length : 1;
    if (remainingUses < usesToBeUsed) {
      return {
        valid: false,
        message: 'Error deuto your maximum license usage count exceeded.',
        statusCode: 422,
        usesExceeded: true,
        remainingUses: remainingUses,
        usesToBeUsed: usesToBeUsed,
        maxMonitoringUses: maxUses,
      };
    }
    return {
      valid: true,
    };
  }
}
