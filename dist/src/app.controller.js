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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const openapi = require("@nestjs/swagger");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const ec2instance_service_1 = require("./shared/services/ec2instance.service");
const appgen_service_1 = require("./shared/services/appgen.service");
let AppController = class AppController {
    constructor(appService, httpService, ec2InstanceService, appGenService) {
        this.appService = appService;
        this.httpService = httpService;
        this.ec2InstanceService = ec2InstanceService;
        this.appGenService = appGenService;
    }
    getHello(req) {
        return this.appService.getHello();
    }
    getInstanceDetails() {
        return this.ec2InstanceService.getCurrentlyRunningServerDetailsWithEc2InstanceInfo();
    }
    getRadioProgram() {
        return this.appGenService.appGenGetRadioProgramming('409047', new Date());
    }
};
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('/get-insance-details'),
    openapi.ApiResponse({ status: 200, type: require("./shared/dtos/ec2instance.dto").Ec2RunningServerWithInstanceInfo }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getInstanceDetails", null);
__decorate([
    (0, common_1.Get)('/test-appgen'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getRadioProgram", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        axios_1.HttpService,
        ec2instance_service_1.Ec2InstanceService,
        appgen_service_1.AppgenService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map