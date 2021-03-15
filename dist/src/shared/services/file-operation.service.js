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
const readline = require("line-reader");
const readlineByline = require("readline");
let FileOperationService = class FileOperationService {
    encodeFile(sonicEncodeCmd, outFilePath) {
        return new Promise((resolve, reject) => {
            try {
                child_process_1.execSync('bash ' + sonicEncodeCmd);
                resolve(outFilePath);
            }
            catch (_a) {
                reject({
                    message: 'Error encountered during encoding!'
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
                        message: 'Key not found'
                    });
                }
                readline.eachLine(logFilePath, function (line) {
                    console.log('Decoder output line: ', line);
                    resolve({ sonicKey: line });
                    return false;
                });
            }
            catch (err) {
                console.error('Caught error while decodibng:', err);
                reject({
                    message: 'Error while decoding'
                });
            }
        });
    }
    decodeFileForMultipleKeys(sonicDecodeCmd, logFilePath) {
        return new Promise((resolve, reject) => {
            try {
                child_process_1.execSync('bash ' + sonicDecodeCmd);
                var fileSizeInBytes = fs.statSync(logFilePath).size;
                if (fileSizeInBytes <= 0) {
                    console.error('empty logfile while decoding. no key found!');
                    reject({
                        message: 'Key not found'
                    });
                }
                var sonicKeys = [];
                var lineReader = readlineByline.createInterface({
                    input: fs.createReadStream(logFilePath)
                });
                lineReader.on('line', function (line) {
                    console.log('Line from file:', line);
                    const isPresent = sonicKeys.find(key => key == line);
                    if (line && !isPresent) {
                        sonicKeys.push(line);
                    }
                });
                lineReader.on('close', function (line) {
                    console.log("Finished");
                    resolve({ sonicKeys: sonicKeys });
                });
            }
            catch (err) {
                console.error('Caught error while decodibng:', err);
                reject({
                    message: 'Error while decoding'
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