import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as mime from 'mime';
import * as uniqid from 'uniqid';
import * as makeDir from 'make-dir';
import * as rimraf from 'rimraf';
import { IUploadedFile } from '../interfaces/UploadedFile.interface';
import { extractFileName } from 'src/shared/utils';
import * as path from 'path';
@Injectable()
export class FileHandlerService {
  async deleteFileAtPath(pathFromRoot: string) {
    if (await this.fileExistsAtPath(pathFromRoot)) {
      fs.unlink(pathFromRoot, err => {
        if (err) {
          console.warn(`Warning: deleting file at path ${pathFromRoot}`, err);
        }
      });
    }
  }

  deleteDirectoryAtPath(pathFromRoot: string) {
    rimraf.sync(pathFromRoot);
  }

  makeDirectoryAt(pathFromRoot: string) {
    return makeDir(pathFromRoot);
  }

  listAllDirectoryInsideDirectory(directoryPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      var directories = fs
        .readdirSync(directoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      resolve(directories);
    });
  }

  listFilesForDirectory(
    directoryPath: string,
  ): Promise<{ files: string[]; path: string }> {
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, function(err, files) {
        if (err) {
          reject(err);
        }
        resolve({ files: files, path: directoryPath });
      });
    });
  }

  fileExistsAtPath(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.access(path, function(error) {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
  downloadFileFromPath(pathFromRoot: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const stream = fs.createReadStream(pathFromRoot);
      resolve(stream);
    });
  }

  async getFileDetailsFromFile(
    pathFromRoot: string,
  ): Promise<[IUploadedFile, any]> {
    return new Promise(async (resolve, reject) => {
      try {
        const originalname = extractFileName(pathFromRoot);
        const fileStat = fs.statSync(pathFromRoot);
        const mimeType = mime.getType(pathFromRoot);
        const fileDetails: IUploadedFile = {
          url: pathFromRoot,
          originalname: originalname,
          destination: path.resolve(pathFromRoot, '..'),
          filename: originalname,
          path: pathFromRoot,
          size: fileStat.size,
          mimetype: mimeType,
        };
        resolve([fileDetails, null]);
      } catch (error) {
        resolve([null, error]);
      }
    });
  }
}
