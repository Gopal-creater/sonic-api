"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
let CronService = CronService_1 = class CronService {
    constructor(schedulerRegistry) {
        this.schedulerRegistry = schedulerRegistry;
        this.logger = new common_1.Logger(CronService_1.name);
    }
    onceAfter0Seconds() {
        this.logger.debug('Called once after 0 seconds');
    }
    getCrons() {
        const jobs = this.schedulerRegistry.getCronJobs();
        jobs.forEach((value, key, map) => {
            let next;
            try {
                next = value.nextDates().toDate();
            }
            catch (e) {
                next = 'error: next fire date is in the past!';
            }
            this.logger.log(`job: ${key} -> next: ${next}`);
        });
    }
    getCron(name) {
        const timeout = this.schedulerRegistry.getCronJob(name);
    }
    addCronJob(name, cronTime) {
        const job = new cron_1.CronJob(cronTime, () => {
            this.logger.warn(`time (${cronTime}) for job ${name} to run!`);
        });
        this.schedulerRegistry.addCronJob(name, job);
        job.start();
        this.logger.warn(`job ${name} added for each minute at ${cronTime} seconds!`);
    }
    deleteCron(name) {
        this.schedulerRegistry.deleteCronJob(name);
        this.logger.warn(`job ${name} deleted!`);
    }
    getIntervals() {
        const intervals = this.schedulerRegistry.getIntervals();
        intervals.forEach(key => this.logger.log(`Interval: ${key}`));
    }
    getInterval(name) {
        const timeout = this.schedulerRegistry.getInterval(name);
    }
    addInterval(name, milliseconds) {
        const callback = () => {
            this.logger.warn(`Interval ${name} executing at time (${milliseconds})!`);
        };
        const interval = setInterval(callback, milliseconds);
        this.schedulerRegistry.addInterval(name, interval);
    }
    deleteInterval(name) {
        this.schedulerRegistry.deleteInterval(name);
        this.logger.warn(`Interval ${name} deleted!`);
    }
    getTimeouts() {
        const timeouts = this.schedulerRegistry.getTimeouts();
        timeouts.forEach(key => this.logger.log(`Timeout: ${key}`));
    }
    getTimeout(name) {
        const timeout = this.schedulerRegistry.getTimeout(name);
    }
    addTimeout(name, milliseconds) {
        const callback = () => {
            this.logger.warn(`Timeout ${name} executing after (${milliseconds})!`);
        };
        const timeout = setTimeout(callback, milliseconds);
        this.schedulerRegistry.addTimeout(name, timeout);
    }
    deleteTimeout(name) {
        this.schedulerRegistry.deleteTimeout(name);
        this.logger.warn(`Timeout ${name} deleted!`);
    }
};
__decorate([
    schedule_1.Timeout(0),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CronService.prototype, "onceAfter0Seconds", null);
CronService = CronService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry])
], CronService);
exports.CronService = CronService;
//# sourceMappingURL=cron.service.js.map