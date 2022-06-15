import { Injectable } from '@nestjs/common';
import { LicenseKey } from 'src/api/licensekey/schemas/licensekey.schema';
import { LicensekeyService } from 'src/api/licensekey/services/licensekey.service';
import { UserDB } from '../../../user/schemas/user.db.schema';
import { TrackService } from '../../../track/track.service';
import { S3FileUploadService } from 'src/api/s3fileupload/s3fileupload.service';
import * as makeDir from 'make-dir';
import { appConfig } from 'src/config';
import { extractFileName } from 'src/shared/utils';
import * as uniqid from 'uniqid';
import * as fs from 'fs';
import * as http from 'https';
import * as mime from 'mime';
import { IUploadedFile } from 'src/shared/interfaces/UploadedFile.interface';

@Injectable()
export class SonickeyUtils {
  constructor(
    private readonly licensekeyService: LicensekeyService,
    private readonly trackService: TrackService,
    private readonly s3FileUploadService:S3FileUploadService
  ) {}
  async checkAndGetValidLicenseForEncode(user: UserDB) {
    const licenses = await this.licensekeyService.findValidLicesesForUser(
      user.sub,
    );
    if (!licenses || licenses.length <= 0) {
      throw new Error(
        'No active license, please get atleast one to perform this action',
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
      return Promise.reject({
        valid: valid,
        message: message,
        remainingUses: remainingUses,
        reservedLicenceCount: reservedLicenceCount,
        remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
        usesToBeUsed: usesToBeUsed,
        maxEncodeUses: maxEncodeUses,
        statusCode: statusCode,
      });
    }
    return currentValidLicense;
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

  async downloadFileFromTrack(track: string) {
    const trackFromDb = await this.trackService.findById(track);
    if (!trackFromDb) {
      throw new Error('track not found');
    }
    const signedUrlForTrack = await this.s3FileUploadService.getSignedUrl(
      trackFromDb.s3OriginalFileMeta.Key,
      10 * 60,
    );

    const filePath = await makeDir(
      `${appConfig.MULTER_DEST}/fileFromTrackStore`,
    );
    await makeDir(`${filePath}/encodedFiles`);
    const originalname = extractFileName(signedUrlForTrack);
    const filename = `${uniqid()}-${originalname}`;
    const destination = `${filePath}/${filename}`;
    const uploaded = await this.download(signedUrlForTrack, destination);
    const fileStat = fs.statSync(destination);
    const mimeType = mime.getType(destination);
    const fileUploadResult: IUploadedFile = {
      url: signedUrlForTrack,
      originalname: originalname,
      destination: filePath,
      filename: filename,
      path: destination,
      size: fileStat.size,
      mimetype: mimeType,
    };
    return {
      fileUploadFromTrackResult: fileUploadResult,
      currentTrack: trackFromDb,
    };
  }

download(
    url: string,
    dest: string,
  ): Promise<{ url: string; dest: string }> {
    return new Promise((resolve, reject) => {
      var file = fs.createWriteStream(dest);
      var request = http
        .get(url, function(response) {
          response.pipe(file);
          file.on('finish', function() {
            file.close();
            resolve({
              url: url,
              dest: dest,
            }); // close() is async, call cb after close completes.
          });
        })
        .on('error', function(err) {
          // Handle errors
          fs.unlink(dest, () => {}); // Delete the file async. (But we don't check the result)
          reject(err);
        });
    });
  }
}
