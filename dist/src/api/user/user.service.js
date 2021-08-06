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
const common_1 = require("@nestjs/common");
const licensekey_service_1 = require("../licensekey/services/licensekey.service");
const licensekey_schema_1 = require("../licensekey/schemas/licensekey.schema");
let UserService = class UserService {
    constructor(licensekeyService, globalAwsService, configService) {
        this.licensekeyService = licensekeyService;
        this.globalAwsService = globalAwsService;
        this.configService = configService;
        this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
        this.cognitoUserPoolId = this.configService.get('COGNITO_USER_POOL_ID');
    }
    async addNewLicense(licenseId, ownerId) {
        const key = await this.licensekeyService.licenseKeyModel.findById(licenseId);
        if (!key) {
            return Promise.reject({
                notFound: true,
                status: 404,
                message: 'Invalid license key',
            });
        }
        const newLKOwner = new licensekey_schema_1.LKOwner();
        newLKOwner.ownerId = ownerId;
        return this.licensekeyService.addOwnerToLicense(licenseId, newLKOwner);
    }
    async addBulkNewLicenses(licenseIds, ownerId) {
        const promises = licenseIds.map(licenseId => {
            const newLKOwner = new licensekey_schema_1.LKOwner();
            newLKOwner.ownerId = ownerId;
            return this.licensekeyService
                .addOwnerToLicense(licenseId, newLKOwner)
                .catch(err => ({
                promiseError: err,
                data: licenseId,
            }));
        });
        return Promise.all(promises).then(values => {
            const failedData = values.filter(item => item['promiseError']);
            const passedData = values.filter(item => !item['promiseError']);
            return {
                passedData: passedData,
                failedData: failedData,
            };
        });
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
            UserPoolId: this.cognitoUserPoolId,
        };
        this.cognitoIdentityServiceProvider.listUsers(params, (err, data) => {
            var _a;
            console.log('users', data);
            console.log('users count', data.Users.length);
            for (let index = 0; index < data.Users.length; index++) {
                const user = data.Users[index];
                const licencesInString = (_a = user.Attributes.find(attr => attr.Name == 'custom:licenseKey')) === null || _a === void 0 ? void 0 : _a.Value;
                if (licencesInString) {
                    const licenceIds = JSON.parse(licencesInString);
                    const ownerId = user.Attributes.find(att => att.Name == 'sub').Value;
                    console.log(`licences for user ${user.Username} id ${ownerId}`, licenceIds);
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
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService,
        global_aws_service_1.GlobalAwsService,
        config_1.ConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map