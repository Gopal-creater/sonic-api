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
exports.UserService = void 0;
const config_1 = require("@nestjs/config");
const global_aws_service_1 = require("./../../shared/modules/global-aws/global-aws.service");
const common_1 = require("@nestjs/common");
const licensekey_service_1 = require("../licensekey/services/licensekey.service");
const licensekey_schema_1 = require("../licensekey/schemas/licensekey.schema");
const index_1 = require("../../shared/utils/index");
let UserService = class UserService {
    constructor(licensekeyService, globalAwsService, configService) {
        this.licensekeyService = licensekeyService;
        this.globalAwsService = globalAwsService;
        this.configService = configService;
        this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
        this.cognitoUserPoolId = this.configService.get('COGNITO_USER_POOL_ID');
    }
    async addNewLicense(licenseId, ownerIdOrUsername) {
        const key = await this.licensekeyService.licenseKeyModel.findById(licenseId);
        if (!key) {
            return Promise.reject({
                notFound: true,
                status: 404,
                message: 'Invalid license key',
            });
        }
        const user = await this.getUserProfile(ownerIdOrUsername);
        if (!user) {
            return Promise.reject({
                notFound: true,
                status: 404,
                message: 'User not found',
            });
        }
        const newLKOwner = new licensekey_schema_1.LKOwner();
        newLKOwner.ownerId = user.UserAttributes.find(attr => attr.Name == 'sub').Value;
        newLKOwner.username = user.Username;
        newLKOwner.email = user.UserAttributes.find(attr => attr.Name == 'email').Value;
        newLKOwner.name = user.Username;
        return this.licensekeyService.addOwnerToLicense(licenseId, newLKOwner);
    }
    async addBulkNewLicenses(licenseIds, ownerIdOrUsername) {
        const user = await this.getUserProfile(ownerIdOrUsername).catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException(err.message);
            }
            throw err;
        });
        const promises = licenseIds.map(async (licenseId) => {
            const newLKOwner = new licensekey_schema_1.LKOwner();
            newLKOwner.ownerId = user.UserAttributes.find(attr => attr.Name == 'sub').Value;
            newLKOwner.username = user.Username;
            newLKOwner.email = user.UserAttributes.find(attr => attr.Name == 'email').Value;
            newLKOwner.name = user.Username;
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
    async getUserProfile(usernameOrSub) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            Username: usernameOrSub,
        };
        if (index_1.isValidUUID(usernameOrSub)) {
            const userDetails = await this.getUserFromSub(usernameOrSub);
            if (!userDetails) {
                return Promise.resolve(null);
            }
            params.Username = userDetails.username;
        }
        const profile = await this.cognitoIdentityServiceProvider
            .adminGetUser(params)
            .promise()
            .catch(err => {
            return Promise.resolve(null);
        });
        if (!profile) {
            return Promise.resolve(null);
        }
        return this.addAttributesObjToProfile(profile);
    }
    async getGroupsForUser(usernameOrSub) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            Username: usernameOrSub,
        };
        if (index_1.isValidUUID(usernameOrSub)) {
            const { username } = await this.getUserFromSub(usernameOrSub);
            params.Username = username;
        }
        return this.cognitoIdentityServiceProvider
            .adminListGroupsForUser(params)
            .promise();
    }
    async getGroup(groupName) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            GroupName: groupName,
        };
        const group = await this.cognitoIdentityServiceProvider
            .getGroup(params)
            .promise()
            .catch(err => {
            return Promise.resolve(null);
        });
        console.log("group", group);
        return group;
    }
    addAttributesObjToProfile(profile) {
        var attributesObj = {};
        for (let index = 0; index < profile.UserAttributes.length; index++) {
            const element = profile.UserAttributes[index];
            attributesObj[element.Name] = element.Value;
        }
        profile['UserAttributesObj'] = attributesObj;
        return profile;
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
    async getUserFromSub(sub) {
        var _a;
        const users = await this.cognitoIdentityServiceProvider
            .listUsers({
            UserPoolId: this.cognitoUserPoolId,
            Filter: `sub=\"${sub}\"`,
        })
            .promise();
        const targetUser = (_a = users === null || users === void 0 ? void 0 : users.Users) === null || _a === void 0 ? void 0 : _a[0];
        if (!targetUser) {
            return null;
        }
        return {
            username: targetUser.Username,
            user: targetUser,
        };
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
    __param(0, common_1.Inject(common_1.forwardRef(() => licensekey_service_1.LicensekeyService))),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService,
        global_aws_service_1.GlobalAwsService,
        config_1.ConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map