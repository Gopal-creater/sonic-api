import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  createParamDecorator,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as makeDir from 'make-dir';
import { appConfig } from '../../config/app.config';
import { extractFileName, isValidHttpUrl } from 'src/shared/utils';
import * as uniqid from 'uniqid';
import * as fs from 'fs';
import * as http from 'https';
import * as mime from 'mime';
import { IUploadedFile } from '../interfaces/UploadedFile.interface';

export const FileFromUrlInterceptor = (fieldName: string) => {
  @Injectable()
  class FileFromUrlInterceptorClass implements NestInterceptor {
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest();
      const url = req.body[fieldName] as string;
      if (!url) {
        throw new BadRequestException(
          `${fieldName} is missing in request body`,
        );
      }
      if(!isValidHttpUrl(url)){
        throw new BadRequestException("Invalid mediaFile Url");
      }
      const currentUserId = req['user']?.['sub'] || 'guestUser';
      const imagePath = await makeDir(
        `${appConfig.MULTER_DEST}/${currentUserId}`,
      );
      await makeDir(`${appConfig.MULTER_DEST}/${currentUserId}/encodedFiles`);
      const originalname = extractFileName(url);
      const filename = `${uniqid()}-${originalname}`;
      const destination = `${imagePath}/${filename}`;
      const uploaded = await this.download(url, destination);
      const fileStat = fs.statSync(destination)
      const mimeType = mime.getType(destination);
      const fileUploadResult: IUploadedFile = {
        fieldname: fieldName,
        url: url,
        originalname: originalname,
        destination: imagePath,
        filename: filename,
        path: destination,
        size: fileStat.size,
        mimetype: mimeType,
      };
      req['fileUploadResult'] = fileUploadResult; //Add fileUploadResult to request object
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


export const UploadedFileFromUrl = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
      return req.fileUploadResult[data];
    } else {
      return req.fileUploadResult;
    }
  },
);