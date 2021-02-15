"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const fs = require("fs");
let StreamService = class StreamService {
    create(createStreamDto) {
        return 'This action adds a new stream';
    }
    async readStream() {
        let writeStream = fs.createWriteStream('stream.mp3');
        var streamUrl = 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p';
        var streamResponse = await axios_1.default({
            method: 'get',
            url: streamUrl,
            responseType: 'stream'
        });
        streamResponse.data.pipe(writeStream);
    }
    findAll() {
        return `This action returns all stream`;
    }
    findOne(id) {
        return `This action returns a #${id} stream`;
    }
    update(id, updateStreamDto) {
        return `This action updates a #${id} stream`;
    }
    remove(id) {
        return `This action removes a #${id} stream`;
    }
};
StreamService = __decorate([
    common_1.Injectable()
], StreamService);
exports.StreamService = StreamService;
//# sourceMappingURL=stream.service.js.map