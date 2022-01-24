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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ec2RunningServerWithInstanceInfo = exports.Ec2InstanceInfo = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class Ec2InstanceInfo {
    static _OPENAPI_METADATA_FACTORY() {
        return { ami_id: { required: true, type: () => String }, hostname: { required: true, type: () => String }, instance_id: { required: true, type: () => String }, instance_type: { required: true, type: () => String }, local_hostname: { required: true, type: () => String }, local_ipv4: { required: true, type: () => String }, mac: { required: true, type: () => String }, public_hostname: { required: true, type: () => String }, public_ipv4: { required: true, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Ec2InstanceInfo.prototype, "ami_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Ec2InstanceInfo.prototype, "hostname", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Ec2InstanceInfo.prototype, "instance_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Ec2InstanceInfo.prototype, "instance_type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Ec2InstanceInfo.prototype, "local_hostname", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Ec2InstanceInfo.prototype, "local_ipv4", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Ec2InstanceInfo.prototype, "mac", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Ec2InstanceInfo.prototype, "public_hostname", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Ec2InstanceInfo.prototype, "public_ipv4", void 0);
exports.Ec2InstanceInfo = Ec2InstanceInfo;
class Ec2RunningServerWithInstanceInfo extends Ec2InstanceInfo {
    static _OPENAPI_METADATA_FACTORY() {
        return { domain_hostname: { required: true, type: () => String }, server_running_port_number: { required: true, type: () => Number } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Ec2RunningServerWithInstanceInfo.prototype, "domain_hostname", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], Ec2RunningServerWithInstanceInfo.prototype, "server_running_port_number", void 0);
exports.Ec2RunningServerWithInstanceInfo = Ec2RunningServerWithInstanceInfo;
//# sourceMappingURL=ec2instance.dto.js.map