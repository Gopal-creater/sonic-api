import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  createParamDecorator,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as makeDir from 'make-dir';
import { appConfig } from '../../config/app.config';
import {
  extractFileName,
  identifyDestinationFolderAndResourceOwnerFromUser,
  isValidHttpUrl,
} from 'src/shared/utils';
import * as uniqid from 'uniqid';
import * as fs from 'fs';
import * as http from 'https';
import * as mime from 'mime';
import { IUploadedFile } from '../interfaces/UploadedFile.interface';
import { TrackService } from '../../api/track/track.service';
import { S3FileUploadService } from '../../api/s3fileupload/s3fileupload.service';
import { UserDB } from '../../api/user/schemas/user.db.schema';

export const FileFromTrackInterceptor = (fieldName: string = 'track') => {
  @Injectable()
  class FileFromUrlInterceptorClass implements NestInterceptor {
    constructor(
      private readonly trackService: TrackService,
      private readonly s3FileUploadService: S3FileUploadService,
    ) {}
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest();
      const track = req.body[fieldName] as string;
      if (!track) {
        throw new BadRequestException(
          `${fieldName} is missing in request body`,
        );
      }
      const trackFromDb = await this.trackService.findById(track);
      if (!trackFromDb) {
        throw new NotFoundException('track not found');
      }
      const signedUrlForTrack = await this.s3FileUploadService.getSignedUrl(
        trackFromDb.s3OriginalFileMeta.Key,
        10 * 60,
      );

      const loggedInUser = req['user'] as UserDB;
      const {
        destinationFolder,
        resourceOwnerObj,
      } = identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);

      const filePath = await makeDir(
        `${appConfig.MULTER_DEST}/${destinationFolder}`,
      );
      await makeDir(`${filePath}/encodedFiles`);
      const originalname = extractFileName(signedUrlForTrack);
      const filename = `${uniqid()}-${originalname}`;
      const destination = `${filePath}/${filename}`;
      const uploaded = await this.download(signedUrlForTrack, destination);
      const fileStat = fs.statSync(destination);
      const mimeType = mime.getType(destination);
      const fileUploadResult: IUploadedFile = {
        fieldname: fieldName,
        url: signedUrlForTrack,
        originalname: originalname,
        destination: filePath,
        filename: filename,
        path: destination,
        size: fileStat.size,
        mimetype: mimeType,
      };
      req['fileUploadFromTrackResult'] = fileUploadResult; //Add fileUploadResult to request object
      req['currentTrack'] = trackFromDb;
      return next.handle();
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
  return mixin(FileFromUrlInterceptorClass);
};

export const UploadedFileFromTrack = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
      return req.fileUploadFromTrackResult[data];
    } else {
      return req.fileUploadFromTrackResult;
    }
  },
);

export const CurrentTrack = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
      return req.currentTrack[data];
    } else {
      return req.currentTrack;
    }
  },
);
