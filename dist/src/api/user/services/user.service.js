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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const config_1 = require("@nestjs/config");
const global_aws_service_1 = require("../../../shared/modules/global-aws/global-aws.service");
const common_1 = require("@nestjs/common");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
const index_1 = require("../../../shared/utils/index");
const radiomonitor_service_1 = require("../../radiomonitor/radiomonitor.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_db_schema_1 = require("../schemas/user.db.schema");
const create_user_dto_1 = require("../dtos/create-user.dto");
const user_group_service_1 = require("./user-group.service");
const user_company_service_1 = require("./user-company.service");
const group_service_1 = require("../../group/group.service");
const company_service_1 = require("../../company/company.service");
const Enums_1 = require("../../../constants/Enums");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const api_key_service_1 = require("../../api-key/api-key.service");
const register_dto_1 = require("../../auth/dto/register.dto");
let UserService = class UserService {
    constructor(licensekeyService, apiKeyService, globalAwsService, groupService, companyService, userModel, configService, userGroupService, userCompanyService, radioMonitorService) {
        this.licensekeyService = licensekeyService;
        this.apiKeyService = apiKeyService;
        this.globalAwsService = globalAwsService;
        this.groupService = groupService;
        this.companyService = companyService;
        this.userModel = userModel;
        this.configService = configService;
        this.userGroupService = userGroupService;
        this.userCompanyService = userCompanyService;
        this.radioMonitorService = radioMonitorService;
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
        if (key.type == Enums_1.ApiKeyType.COMPANY) {
            return Promise.reject({
                status: 400,
                message: 'You are trying to add a license that belongs to company type or a individual type.',
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
        return this.licensekeyService.addOwnerToLicense(licenseId, user.sub);
    }
    async addBulkNewLicenses(licenseIds, ownerIdOrUsername) {
        const user = await this.getUserProfile(ownerIdOrUsername).catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException(err.message);
            }
            throw err;
        });
        const promises = licenseIds.map(async (licenseId) => {
            return this.licensekeyService
                .addOwnerToLicense(licenseId, user.sub)
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
        if (index_1.isValidUUID(usernameOrSub)) {
            return this.findById(usernameOrSub);
        }
        else {
            return this.findOne({ username: usernameOrSub });
        }
    }
    async adminListGroupsForUser(usernameOrSub) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            Username: usernameOrSub,
        };
        if (index_1.isValidUUID(usernameOrSub)) {
            const { username } = await this.getCognitoUserFromSub(usernameOrSub);
            params.Username = username;
        }
        const adminListGroupsForUserResponse = await this.cognitoIdentityServiceProvider
            .adminListGroupsForUser(params)
            .promise();
        const groupNames = adminListGroupsForUserResponse.Groups.map(group => group.GroupName);
        return {
            adminListGroupsForUserResponse: adminListGroupsForUserResponse,
            groupNames: groupNames,
        };
    }
    async cognitoCreateGroup(groupName) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            Description: groupName,
            GroupName: groupName,
        };
        const cognitoCreateGroupResponse = await this.cognitoIdentityServiceProvider
            .createGroup(params)
            .promise();
        return {
            cognitoCreateGroup: cognitoCreateGroupResponse,
            groupName: groupName,
        };
    }
    async cognitoDeleteGroup(groupName) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            GroupName: groupName,
        };
        const cognitoDeleteGroupResponse = await this.cognitoIdentityServiceProvider
            .deleteGroup(params)
            .promise();
        return {
            cognitoDeleteGroup: cognitoDeleteGroupResponse,
            groupName: groupName,
        };
    }
    async cognitoGetGroup(groupName) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            GroupName: groupName,
        };
        const group = await this.cognitoIdentityServiceProvider
            .getGroup(params)
            .promise();
        return group.Group;
    }
    async adminAddUserToGroup(usernameOrSub, groupName) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            GroupName: groupName,
            Username: usernameOrSub,
        };
        if (index_1.isValidUUID(usernameOrSub)) {
            const { username } = await this.getCognitoUserFromSub(usernameOrSub);
            params.Username = username;
        }
        const group = await this.cognitoIdentityServiceProvider
            .adminAddUserToGroup(params)
            .promise();
        return group;
    }
    async adminRemoveUserFromGroup(usernameOrSub, groupName) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            GroupName: groupName,
            Username: usernameOrSub,
        };
        if (index_1.isValidUUID(usernameOrSub)) {
            const { username } = await this.getCognitoUserFromSub(usernameOrSub);
            params.Username = username;
        }
        const group = await this.cognitoIdentityServiceProvider
            .adminRemoveUserFromGroup(params)
            .promise();
        return group;
    }
    async adminSetUserPassword(usernameOrSub, password) {
        const params = {
            Password: password,
            Permanent: true,
            Username: usernameOrSub,
            UserPoolId: this.cognitoUserPoolId,
        };
        if (index_1.isValidUUID(usernameOrSub)) {
            const { username } = await this.getCognitoUserFromSub(usernameOrSub);
            params.Username = username;
        }
        const setUserPasswordRes = await this.cognitoIdentityServiceProvider
            .adminSetUserPassword(params)
            .promise();
        return setUserPasswordRes;
    }
    async adminDeleteUser(usernameOrSub) {
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            Username: usernameOrSub,
        };
        if (index_1.isValidUUID(usernameOrSub)) {
            const { username } = await this.getCognitoUserFromSub(usernameOrSub);
            params.Username = username;
        }
        const deleted = await this.cognitoIdentityServiceProvider
            .adminDeleteUser(params)
            .promise();
        return deleted;
    }
    convertUserAttributesToObj(userAttributeType) {
        var attributesObj = {};
        for (let index = 0; index < userAttributeType.length; index++) {
            const element = userAttributeType[index];
            attributesObj[element.Name] = element.Value;
        }
        return attributesObj;
    }
    async syncUserFromCognitoToMongooDb(usernameOrSub) {
        var _a, _b, _c, _d, _e;
        const userFromCognito = await this.getCognitoUser(usernameOrSub);
        const username = userFromCognito.Username;
        const userStatus = userFromCognito.UserStatus;
        const enabled = userFromCognito.Enabled;
        const mfaOptions = userFromCognito.MFAOptions;
        const sub = (_a = userFromCognito.Attributes.find(attr => attr.Name == 'sub')) === null || _a === void 0 ? void 0 : _a.Value;
        const email = (_b = userFromCognito.Attributes.find(attr => attr.Name == 'email')) === null || _b === void 0 ? void 0 : _b.Value;
        const email_verified = (_c = userFromCognito.Attributes.find(attr => attr.Name == 'email_verified')) === null || _c === void 0 ? void 0 : _c.Value;
        const phone_number = (_d = userFromCognito.Attributes.find(attr => attr.Name == 'phone_number')) === null || _d === void 0 ? void 0 : _d.Value;
        const phone_number_verified = (_e = userFromCognito.Attributes.find(attr => attr.Name == 'phone_number_verified')) === null || _e === void 0 ? void 0 : _e.Value;
        const userToSaveInDb = new create_user_dto_1.CreateUserDto({
            _id: sub,
            sub: sub,
            username: username,
            email: email,
            email_verified: email_verified == 'true',
            phone_number: phone_number,
            user_status: userStatus,
            enabled: enabled,
            mfa_options: mfaOptions,
            phone_number_verified: phone_number_verified == 'true',
        });
        var userFromDb = await this.userModel.findOneAndUpdate({
            _id: userToSaveInDb.sub,
        }, userToSaveInDb, { upsert: true, new: true });
        var userGroups = await this.adminListGroupsForUser(username);
        if (!userGroups.groupNames.includes(Enums_1.Roles.PORTAL_USER) &&
            !userGroups.groupNames.includes(Enums_1.Roles.WPMS_USER)) {
            userGroups.groupNames = [...userGroups.groupNames, Enums_1.Roles.PORTAL_USER];
        }
        const userGroupsToDbGroups = await this.groupService.groupModel.find({
            name: { $in: userGroups.groupNames },
        });
        userFromDb = await this.userGroupService.addUserToGroups(userFromDb, userGroupsToDbGroups);
        return userFromDb;
    }
    async syncUsersFromCognitoToMongooDb(limit = 50, paginationToken = '', itritation = 1, usersCount = 0) {
        var e_1, _a;
        var _b, _c, _d, _e, _f;
        console.log('Itritation', itritation, 'limit', limit, 'paginationToken', paginationToken);
        const params = {
            UserPoolId: this.cognitoUserPoolId,
            Limit: limit,
        };
        if (paginationToken) {
            params['PaginationToken'] = paginationToken;
        }
        var { Users, PaginationToken, } = await this.cognitoIdentityServiceProvider.listUsers(params).promise();
        usersCount = usersCount + Users.length;
        console.log('users count', usersCount);
        console.log('Next PaginationToken', PaginationToken);
        try {
            for (var Users_1 = __asyncValues(Users), Users_1_1; Users_1_1 = await Users_1.next(), !Users_1_1.done;) {
                const user = Users_1_1.value;
                const username = user.Username;
                const userStatus = user.UserStatus;
                const enabled = user.Enabled;
                const mfaOptions = user.MFAOptions;
                const sub = (_b = user.Attributes.find(attr => attr.Name == 'sub')) === null || _b === void 0 ? void 0 : _b.Value;
                const email = (_c = user.Attributes.find(attr => attr.Name == 'email')) === null || _c === void 0 ? void 0 : _c.Value;
                const email_verified = (_d = user.Attributes.find(attr => attr.Name == 'email_verified')) === null || _d === void 0 ? void 0 : _d.Value;
                const phone_number = (_e = user.Attributes.find(attr => attr.Name == 'phone_number')) === null || _e === void 0 ? void 0 : _e.Value;
                const phone_number_verified = (_f = user.Attributes.find(attr => attr.Name == 'phone_number_verified')) === null || _f === void 0 ? void 0 : _f.Value;
                const userToSaveInDb = new create_user_dto_1.CreateUserDto({
                    _id: sub,
                    sub: sub,
                    username: username,
                    email: email,
                    email_verified: email_verified == 'true',
                    phone_number: phone_number,
                    user_status: userStatus,
                    enabled: enabled,
                    mfa_options: mfaOptions,
                    phone_number_verified: phone_number_verified == 'true',
                });
                const userFromDb = await this.userModel.findOneAndUpdate({
                    _id: userToSaveInDb.sub,
                }, userToSaveInDb, { upsert: true, new: true });
                const userGroups = await this.adminListGroupsForUser(username);
                if (!userGroups.groupNames.includes(Enums_1.Roles.PORTAL_USER) &&
                    !userGroups.groupNames.includes(Enums_1.Roles.WPMS_USER)) {
                    userGroups.groupNames = [...userGroups.groupNames, Enums_1.Roles.PORTAL_USER];
                }
                console.log('userGroups.groupNames', userGroups.groupNames);
                const userGroupsToDbGroups = await this.groupService.groupModel.find({
                    name: { $in: userGroups.groupNames },
                });
                console.log('userGroupsToDbGroups', userGroupsToDbGroups);
                await this.userGroupService.addUserToGroups(userFromDb, userGroupsToDbGroups);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (Users_1_1 && !Users_1_1.done && (_a = Users_1.return)) await _a.call(Users_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!PaginationToken) {
            console.log('Finishaed Get Users, Total Users are', usersCount);
            return;
        }
        else {
            await this.syncUsersFromCognitoToMongooDb(limit, PaginationToken, itritation + 1, usersCount);
        }
    }
    async listUsers(queryDto) {
        const { limit, skip, sort, page, filter, select, populate, relationalFilter, } = queryDto;
        var paginateOptions = {};
        paginateOptions['sort'] = sort;
        paginateOptions['select'] = select;
        paginateOptions['populate'] = populate;
        paginateOptions['offset'] = skip;
        paginateOptions['page'] = page;
        paginateOptions['limit'] = limit;
        const userAggregate = this.userModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            {
                $lookup: {
                    from: 'Group',
                    localField: 'groups',
                    foreignField: '_id',
                    as: 'groups',
                },
            },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'companies',
                    foreignField: '_id',
                    as: 'companies',
                },
            },
            {
                $match: Object.assign({}, relationalFilter),
            },
        ]);
        return this.userModel['aggregatePaginate'](userAggregate, paginateOptions);
    }
    async getCognitoUser(usernameOrSub) {
        var _a;
        var user;
        if (index_1.isValidUUID(usernameOrSub)) {
            const users = await this.cognitoIdentityServiceProvider
                .listUsers({
                UserPoolId: this.cognitoUserPoolId,
                Filter: `sub=\"${usernameOrSub}\"`,
            })
                .promise();
            user = (_a = users === null || users === void 0 ? void 0 : users.Users) === null || _a === void 0 ? void 0 : _a[0];
        }
        else {
            const adminGetUser = await this.cognitoIdentityServiceProvider
                .adminGetUser({
                UserPoolId: this.cognitoUserPoolId,
                Username: usernameOrSub,
            })
                .promise();
            user = adminGetUser;
            user.Attributes = adminGetUser.UserAttributes;
        }
        return user;
    }
    async getCognitoUserFromSub(sub) {
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
    async cognitoCreateUser(cognitoCreateUserDTO) {
        var _a, _b;
        var { userName, email, group, company, password, phoneNumber = '', isEmailVerified = false, isPhoneNumberVerified = false, sendInvitationByEmail = false, } = cognitoCreateUserDTO;
        var registerNewUserParams = {
            UserPoolId: this.cognitoUserPoolId,
            Username: userName,
            TemporaryPassword: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
                {
                    Name: 'email_verified',
                    Value: (_a = isEmailVerified === null || isEmailVerified === void 0 ? void 0 : isEmailVerified.toString) === null || _a === void 0 ? void 0 : _a.call(isEmailVerified),
                },
                {
                    Name: 'phone_number',
                    Value: phoneNumber,
                },
                {
                    Name: 'phone_number_verified',
                    Value: (_b = isPhoneNumberVerified === null || isPhoneNumberVerified === void 0 ? void 0 : isPhoneNumberVerified.toString) === null || _b === void 0 ? void 0 : _b.call(isPhoneNumberVerified),
                },
            ],
        };
        if (sendInvitationByEmail) {
            registerNewUserParams['DesiredDeliveryMediums'] = ['EMAIL'];
        }
        else {
            registerNewUserParams['MessageAction'] = 'SUPPRESS';
        }
        const cognitoUserCreated = await this.cognitoIdentityServiceProvider
            .adminCreateUser(registerNewUserParams)
            .promise();
        userName = cognitoUserCreated.User.Username;
        var userDb = await this.syncUserFromCognitoToMongooDb(userName);
        const groupDb = await this.groupService.findById(group);
        if (groupDb) {
            await this.adminAddUserToGroup(userName, groupDb.name).catch(err => {
                console.warn('Warning: error adding user to group in cognito', err);
            });
            userDb = await this.userGroupService.addUserToGroup(userDb, groupDb);
        }
        if (company) {
            const companyDb = await this.companyService.findById(company);
            await this.adminAddUserToGroup(userName, `COM_${companyDb.name}`).catch(err => {
                console.warn('Warning: error adding user to group company in cognito', err);
            });
            userDb = await this.userCompanyService.addUserToCompany(userDb, companyDb);
        }
        if ((groupDb === null || groupDb === void 0 ? void 0 : groupDb.name) !== Enums_1.Roles.WPMS_USER) {
            await this.addDefaultLicenseToUser(userName);
        }
        return {
            cognitoUserCreated: cognitoUserCreated,
            userDb: userDb,
        };
    }
    async registerAsWpmsUser(wpmsUserRegisterDTO, sendInvitationByEmail = false) {
        var _a, _b, _c;
        var { userName, email, password, phoneNumber = '', country } = wpmsUserRegisterDTO;
        var registerNewUserParams = {
            UserPoolId: this.cognitoUserPoolId,
            Username: userName,
            TemporaryPassword: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
                {
                    Name: 'phone_number',
                    Value: phoneNumber,
                },
            ],
        };
        if (sendInvitationByEmail) {
            registerNewUserParams['DesiredDeliveryMediums'] = ['EMAIL'];
        }
        else {
            registerNewUserParams['MessageAction'] = 'SUPPRESS';
        }
        const cognitoUserCreated = await this.cognitoIdentityServiceProvider
            .adminCreateUser(registerNewUserParams)
            .promise();
        const username = cognitoUserCreated.User.Username;
        await this.adminSetUserPassword(username, password);
        const enabled = cognitoUserCreated.User.Enabled;
        const mfaOptions = cognitoUserCreated.User.MFAOptions;
        const sub = (_a = cognitoUserCreated.User.Attributes.find(attr => attr.Name == 'sub')) === null || _a === void 0 ? void 0 : _a.Value;
        const email_verified = (_b = cognitoUserCreated.User.Attributes.find(attr => attr.Name == 'email_verified')) === null || _b === void 0 ? void 0 : _b.Value;
        const phone_number_verified = (_c = cognitoUserCreated.User.Attributes.find(attr => attr.Name == 'phone_number_verified')) === null || _c === void 0 ? void 0 : _c.Value;
        const userToSaveInDb = await this.userModel.create({
            _id: sub,
            sub: sub,
            username: username,
            email: email,
            email_verified: email_verified == 'true',
            phone_number: phoneNumber,
            phone_number_verified: phone_number_verified == 'true',
            user_status: 'Confirmed',
            country: country,
            enabled: enabled,
            mfa_options: mfaOptions,
        });
        var userDb = await userToSaveInDb.save();
        const wpmsGroupDb = await this.groupService.findOne({
            name: Enums_1.Roles.WPMS_USER,
        });
        if (wpmsGroupDb) {
            await this.adminAddUserToGroup(userName, wpmsGroupDb.name).catch(err => {
                console.warn('Warning: error adding user to group in cognito', err);
            });
            userDb = await this.userGroupService.addUserToGroup(userDb, wpmsGroupDb);
        }
        return {
            cognitoUserCreated: cognitoUserCreated,
            userDb: userDb,
        };
    }
    async addMonitoringSubscriptionFromMonitoringGroup(usernameOrSub) {
        return this.radioMonitorService.addUserFromHisMonitoringGroupToSubscribeRadioMonitoring(usernameOrSub);
    }
    async addDefaultLicenseToUser(ownerIdOrUsername) {
        const defaultLicense = await this.licensekeyService.createDefaultLicenseToAssignUser();
        return this.addNewLicense(defaultLicense.key, ownerIdOrUsername);
    }
    async create(createUserDto) {
        const newUser = await this.userModel.create(createUserDto);
        return newUser.save();
    }
    findAll() {
        return this.userModel.find();
    }
    findOne(filter) {
        return this.userModel.findOne(filter);
    }
    findById(id) {
        return this.userModel.findById(id);
    }
    findByEmail(email) {
        return this.userModel.findOne({ email: email });
    }
    findByUsername(username) {
        return this.userModel.findOne({ username: username });
    }
    update(id, updateUserDto) {
        return this.userModel.findByIdAndUpdate(id, updateUserDto);
    }
    removeById(id) {
        return this.userModel.findByIdAndRemove(id);
    }
    async getCount(queryDto) {
        const { filter, includeGroupData } = queryDto;
        return this.userModel.find(filter || {}).count();
    }
    async getEstimateCount() {
        return this.userModel.estimatedDocumentCount();
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => licensekey_service_1.LicensekeyService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => api_key_service_1.ApiKeyService))),
    __param(5, mongoose_1.InjectModel(user_db_schema_1.UserSchemaName)),
    __param(9, common_1.Inject(common_1.forwardRef(() => radiomonitor_service_1.RadioMonitorService))),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService,
        api_key_service_1.ApiKeyService,
        global_aws_service_1.GlobalAwsService,
        group_service_1.GroupService,
        company_service_1.CompanyService,
        mongoose_2.Model,
        config_1.ConfigService,
        user_group_service_1.UserGroupService,
        user_company_service_1.UserCompanyService,
        radiomonitor_service_1.RadioMonitorService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map