"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppgenService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
require("moment-timezone");
const axios_1 = require("axios");
let AppgenService = class AppgenService {
    constructor() {
        this.partnerId = process.env.APPGEN_PARTNER_ID;
        this.apiKey = process.env.APPGEN_API_KEY;
    }
    getProgramTimeInSecs(srvDateTime, destTZ) {
        const destDatestring = moment(srvDateTime)
            .tz(destTZ)
            .format();
        const destDateTime = new Date(destDatestring);
        return (destDateTime.getHours() * 3600 +
            destDateTime.getMinutes() * 60 +
            destDateTime.getSeconds());
    }
    appGenGetRadioProgramming(appGenStationId, detectedAt) {
        const endpoint = 'https://partners.mytuner.mobi/api/v1/' +
            this.partnerId +
            '/radio-programming?station_id=' +
            appGenStationId;
        return axios_1.default
            .get(endpoint, {
            headers: {
                Authorization: 'APikey ' + this.apiKey,
                Accept: 'application/json',
            },
        })
            .then(res => {
            console.log('appgen: api response status: ', res.status);
            let progs = res.data;
            let secs = this.getProgramTimeInSecs(detectedAt, progs.timezone);
            let day = moment.weekdaysShort(detectedAt.getDay()).toLowerCase();
            let title = '', subtitle = '';
            console.log('appgen: finding prog at secs:', secs, ' on day:', day);
            for (const program of progs.radio_programming) {
                let res = false;
                if (secs >= program.start_time && secs <= program.end_time) {
                    if (program.mon && day == 'mon')
                        res = true;
                    if (program.tue && day == 'tue')
                        res = true;
                    if (program.wed && day == 'wed')
                        res = true;
                    if (program.thu && day == 'thu')
                        res = true;
                    if (program.fri && day == 'fri')
                        res = true;
                    if (program.sat && day == 'sat')
                        res = true;
                    if (program.sun && day == 'sun')
                        res = true;
                }
                if (res) {
                    title = program.title;
                    subtitle = program.subtitle;
                    break;
                }
            }
            return { title: title, subtitle: subtitle, dj: '' };
        });
    }
};
AppgenService = __decorate([
    (0, common_1.Injectable)()
], AppgenService);
exports.AppgenService = AppgenService;
//# sourceMappingURL=appgen.service.js.map