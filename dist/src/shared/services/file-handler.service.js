"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandlerService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const mime = require("mime");
const makeDir = require("make-dir");
const rimraf = require("rimraf");
const utils_1 = require("../utils");
const path = require("path");
let FileHandlerService = class FileHandlerService {
    async deleteFileAtPath(pathFromRoot) {
        if (await this.fileExistsAtPath(pathFromRoot)) {
            fs.unlink(pathFromRoot, err => {
                if (err) {
                    console.warn(`Warning: deleting file at path ${pathFromRoot}`, err);
                }
            });
        }
    }
    deleteDirectoryAtPath(pathFromRoot) {
        rimraf.sync(pathFromRoot);
    }
    makeDirectoryAt(pathFromRoot) {
        return makeDir(pathFromRoot);
    }
    listAllDirectoryInsideDirectory(directoryPath) {
        return new Promise((resolve, reject) => {
            var directories = fs
                .readdirSync(directoryPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            resolve(directories);
        });
    }
    listFilesForDirectory(directoryPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, function (err, files) {
                if (err) {
                    reject(err);
                }
                resolve({ files: files, path: directoryPath });
            });
        });
    }
    fileExistsAtPath(path) {
        return new Promise((resolve, reject) => {
            fs.access(path, function (error) {
                if (error) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    downloadFileFromPath(pathFromRoot) {
        return new Promise(async (resolve, reject) => {
            const stream = fs.createReadStream(pathFromRoot);
            resolve(stream);
        });
    }
    async getFileDetailsFromFile(pathFromRoot) {
        return new Promise(async (resolve, reject) => {
            try {
                const originalname = utils_1.extractFileName(pathFromRoot);
                const fileStat = fs.statSync(pathFromRoot);
                const mimeType = mime.getType(pathFromRoot);
                const fileDetails = {
                    url: pathFromRoot,
                    originalname: originalname,
                    destination: path.resolve(pathFromRoot, '..'),
                    filename: originalname,
                    path: pathFromRoot,
                    size: fileStat.size,
                    mimetype: mimeType,
                };
                resolve([fileDetails, null]);
            }
            catch (error) {
                resolve([null, error]);
            }
        });
    }
};
FileHandlerService = __decorate([
    common_1.Injectable()
], FileHandlerService);
exports.FileHandlerService = FileHandlerService;
//# sourceMappingURL=file-handler.service.js.map