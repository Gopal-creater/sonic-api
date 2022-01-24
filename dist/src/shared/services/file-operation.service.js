"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileOperationService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const fs = require("fs");
const _ = require("lodash");
const readline = require("line-reader");
let FileOperationService = class FileOperationService {
    encodeFile(sonicEncodeCmd, outFilePath) {
        return new Promise((resolve, reject) => {
            try {
                child_process_1.execSync('bash ' + sonicEncodeCmd);
                resolve(outFilePath);
            }
            catch (_a) {
                reject({
                    message: 'Error encountered during encoding!',
                });
            }
        });
    }
    decodeFile(sonicDecodeCmd, logFilePath) {
        return new Promise((resolve, reject) => {
            try {
                child_process_1.execSync('bash ' + sonicDecodeCmd);
                var fileSizeInBytes = fs.statSync(logFilePath).size;
                if (fileSizeInBytes <= 0) {
                    console.error('empty logfile while decoding. no key found!');
                    reject({
                        message: 'Key not found',
                    });
                }
                readline.eachLine(logFilePath, function (line) {
                    var _a;
                    console.log('Decoder output line: ', line);
                    const sonicKey = (_a = line === null || line === void 0 ? void 0 : line.split(': ')[1]) === null || _a === void 0 ? void 0 : _a.trim();
                    resolve({ sonicKey: sonicKey });
                    return false;
                });
            }
            catch (err) {
                console.error('Caught error while decodibng:', err);
                reject({
                    message: 'Error while decoding',
                });
            }
        });
    }
    decodeFileForMultipleKeys(sonicDecodeCmd, logFilePath) {
        return new Promise((resolve, reject) => {
            try {
                child_process_1.execSync('bash ' + sonicDecodeCmd);
                var decodeResponses = [];
                let rawdata = fs.readFileSync(logFilePath, { encoding: 'utf8' });
                console.log('rawdata', rawdata);
                try {
                    decodeResponses = JSON.parse(rawdata);
                }
                catch (error) {
                    console.log('error parsing decoded data', error);
                }
                console.log('decodeResponses', decodeResponses);
                decodeResponses = _.unionBy(decodeResponses, 'sonicKey');
                resolve({ sonicKeys: decodeResponses });
            }
            catch (err) {
                console.error('Caught error while decodibng:', err);
                reject({
                    message: (err === null || err === void 0 ? void 0 : err.message) || 'Error while decoding',
                });
            }
        });
    }
};
FileOperationService = __decorate([
    common_1.Injectable()
], FileOperationService);
exports.FileOperationService = FileOperationService;
//# sourceMappingURL=file-operation.service.js.map