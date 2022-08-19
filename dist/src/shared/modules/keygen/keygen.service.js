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
exports.KeygenService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_fetch_1 = require("node-fetch");
let KeygenService = class KeygenService {
    constructor(configService) {
        this.configService = configService;
        this.apiBaseUrl = `https://api.keygen.sh/v1/accounts/${this.configService.get('KEYGEN_ACCOUNT_ID')}`;
        this.licenceEndPoint = `${this.apiBaseUrl}/licenses`;
        this.credentials = Buffer.from(`${this.configService.get('KEYGEN_USER_EMAIL')}:${this.configService.get('KEYGEN_USER_PASSWORD')}`).toString('base64');
        this.adminToken = this.configService.get('KEYGEN_ADMIN_TOKEN');
    }
    async generateToken() {
        return (0, node_fetch_1.default)(`${this.apiBaseUrl}/tokens`, {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.api+json',
                Authorization: `Basic ${this.credentials}`,
            },
        }).then(response => response.json());
    }
    async createLicense(license) {
        return (0, node_fetch_1.default)(this.licenceEndPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${this.adminToken}`,
            },
            body: JSON.stringify({
                data: {
                    type: 'licenses',
                    attributes: Object.assign({}, license.attribute),
                    relationships: {
                        policy: {
                            data: {
                                type: 'policies',
                                id: license.relation.policyId,
                            },
                        },
                        user: {
                            data: {
                                type: 'users',
                                id: license.relation.userId,
                            },
                        },
                    },
                },
            }),
        }).then(response => response.json());
    }
    async getAllLicenses(query) {
        return (0, node_fetch_1.default)(`${this.licenceEndPoint}?${query}`, {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${this.adminToken}`,
            },
        }).then(response => response.json());
    }
    async getLicenseById(id) {
        return (0, node_fetch_1.default)(`${this.licenceEndPoint}/${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${this.adminToken}`,
            },
        }).then(response => response.json());
    }
    async validateLicence(id) {
        return (0, node_fetch_1.default)(`${this.licenceEndPoint}/${id}/actions/validate`, {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${this.adminToken}`,
            },
        }).then(response => response.json());
    }
    async updateLicense(id, license) {
        return (0, node_fetch_1.default)(`${this.licenceEndPoint}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${this.adminToken}`,
            },
            body: JSON.stringify({
                data: {
                    type: 'licenses',
                    attributes: Object.assign({}, license),
                },
            }),
        }).then(response => response.json());
    }
    async incrementUsage(id, increment = 1) {
        return (0, node_fetch_1.default)(`${this.licenceEndPoint}/${id}/actions/increment-usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${this.adminToken}`,
            },
            body: JSON.stringify({
                meta: {
                    increment: increment,
                },
            }),
        }).then(response => response.json());
    }
    async decrementUsage(id, decrementBy = 1) {
        return (0, node_fetch_1.default)(`${this.licenceEndPoint}/${id}/actions/decrement-usage`, {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${this.adminToken}`,
            },
            body: JSON.stringify({
                meta: {
                    decrement: decrementBy,
                },
            }),
        }).then(response => response.json());
    }
    async resetUsage(id) {
        return (0, node_fetch_1.default)(`${this.licenceEndPoint}/${id}/actions/reset-usage`, {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${this.adminToken}`,
            },
        }).then(response => response.json());
    }
    async deleteLicense(id) {
        return (0, node_fetch_1.default)(`${this.licenceEndPoint}/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${this.adminToken}`,
            },
        }).then(response => response.json());
    }
};
KeygenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KeygenService);
exports.KeygenService = KeygenService;
//# sourceMappingURL=keygen.service.js.map