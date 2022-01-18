"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ec2InstanceService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const Enums_1 = require("../../constants/Enums");
const utils_1 = require("../utils");
let Ec2InstanceService = class Ec2InstanceService {
    getInstanceMetaData() {
        return axios_1.default.get('http://169.254.169.254/latest/meta-data/').then(res => {
            return res.data;
        });
    }
    getInstanceDetailsForMetaData(metadata) {
        return axios_1.default
            .get(`http://169.254.169.254/latest/meta-data/${metadata}`)
            .then(res => {
            return res.data;
        });
    }
    async getInstanceDetails() {
        const metadataArr = utils_1.enumToArrayOfObject(Enums_1.EC2InstanceMetadata);
        const promises = metadataArr.map(({ key, value }) => {
            return this.getInstanceDetailsForMetaData(value)
                .then(data => {
                var obj = {};
                obj[key] = data;
                return obj;
            })
                .catch(err => {
                var obj = {};
                obj[key] = null;
                return obj;
            });
        });
        return Promise.all(promises).then(values => {
            return Object.assign({}, ...values);
        });
    }
    async getCurrentlyRunningServerDetailsWithEc2InstanceInfo() {
        const ec2InstanceDetails = await this.getInstanceDetails();
        const port = 8000;
        const domain_hostname = 'https://sonicserver.arba-dev.uk';
        return Object.assign(Object.assign({}, ec2InstanceDetails), { server_running_port_number: port, domain_hostname: domain_hostname });
    }
};
Ec2InstanceService = __decorate([
    common_1.Injectable()
], Ec2InstanceService);
exports.Ec2InstanceService = Ec2InstanceService;
//# sourceMappingURL=ec2instance.service.js.map