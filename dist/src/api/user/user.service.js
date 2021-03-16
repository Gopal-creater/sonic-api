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
exports.UserService = void 0;
const config_1 = require("@nestjs/config");
const global_aws_service_1 = require("./../../shared/modules/global-aws/global-aws.service");
const keygen_service_1 = require("../../shared/modules/keygen/keygen.service");
const common_1 = require("@nestjs/common");
let UserService = class UserService {
    constructor(keygenService, globalAwsService, configService) {
        this.keygenService = keygenService;
        this.globalAwsService = globalAwsService;
        this.configService = configService;
        this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
        this.cognitoUserPoolId = this.configService.get('COGNITO_USER_POOL_ID');
    }
    async listAllLicensesOfOwner(ownerId) {
        const { data, errors } = await this.keygenService.getAllLicenses(`metadata[ownerId]=${ownerId}`);
        if (errors)
            return Promise.reject(errors);
        return data;
    }
    async addNewLicense(licenseId, ownerId) {
        var _a, _b, _c;
        const { data, errors } = await this.keygenService.getLicenseById(licenseId);
        if (!data) {
            throw new common_1.NotFoundException('Invalid license key');
        }
        if ((_b = (_a = data === null || data === void 0 ? void 0 : data.attributes) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.ownerId) {
            throw new common_1.BadRequestException('This key is already used by someone');
        }
        const { data: updatedData, errors: errorsUpdate } = await this.keygenService.updateLicense(licenseId, {
            metadata: Object.assign(Object.assign({}, (_c = data === null || data === void 0 ? void 0 : data.attributes) === null || _c === void 0 ? void 0 : _c.metadata), { ownerId: ownerId }),
        });
        if (errorsUpdate)
            return Promise.reject(errorsUpdate);
        return updatedData;
    }
    async addBulkNewLicenses(licenseIds, ownerId) {
        const promises = licenseIds.map(id => this.addNewLicense(id, ownerId));
        return Promise.all(promises);
    }
    async getUserProfile(username) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            Username: username,
        };
        return new Promise((resolve, reject) => {
            this.cognitoIdentityServiceProvider.adminGetUser(params, function (err, data) {
                if (err) {
                    reject(err);
                }
                var result = {};
                for (let index = 0; index < data.UserAttributes.length; index++) {
                    const element = data.UserAttributes[index];
                    result[element.Name] = element.Value;
                }
                resolve(result);
            });
        });
    }
    async exportFromLic() {
        const params = {
            UserPoolId: this.cognitoUserPoolId
        };
        this.cognitoIdentityServiceProvider.listUsers(params, function (err, data) {
            var _a;
            console.log("users", data);
            console.log("users count", data.Users.length);
            for (let index = 0; index < data.Users.length; index++) {
                const user = data.Users[index];
                const licencesInString = (_a = user.Attributes.find(attr => attr.Name == "custom:licenseKey")) === null || _a === void 0 ? void 0 : _a.Value;
                if (licencesInString) {
                    const licences = JSON.parse(licencesInString);
                    console.log(`licences for user ${user.Username}`, licences);
                    licences.forEach(lic => {
                    });
                }
            }
        });
    }
    async updateUserWithCustomField(username, updateUserAttributes) {
        const params = {
            UserAttributes: [...updateUserAttributes],
            UserPoolId: this.cognitoUserPoolId,
            Username: username,
        };
        return new Promise((resolve, reject) => {
            this.cognitoIdentityServiceProvider.adminUpdateUserAttributes(params, function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [keygen_service_1.KeygenService,
        global_aws_service_1.GlobalAwsService,
        config_1.ConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map