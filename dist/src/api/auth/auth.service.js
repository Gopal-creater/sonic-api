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
exports.AuthService = void 0;
const global_aws_service_1 = require("../../shared/modules/global-aws/global-aws.service");
const auth_config_1 = require("./config/auth.config");
const common_1 = require("@nestjs/common");
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const user_service_1 = require("../user/services/user.service");
const register_dto_1 = require("./dto/register.dto");
const partner_service_1 = require("../partner/services/partner.service");
const Enums_1 = require("../../constants/Enums");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(authConfig, globalAwsService, userService, partnerService, configService) {
        this.authConfig = authConfig;
        this.globalAwsService = globalAwsService;
        this.userService = userService;
        this.partnerService = partnerService;
        this.configService = configService;
        this.userPool = new amazon_cognito_identity_js_1.CognitoUserPool({
            UserPoolId: this.authConfig.userPoolId,
            ClientId: this.authConfig.clientId,
        });
        this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
    }
    async login(userName, password) {
        const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails({
            Username: userName,
            Password: password,
        });
        const userData = {
            Username: userName,
            Pool: this.userPool,
        };
        const newUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        const cognitoUserSession = await new Promise((resolve, reject) => {
            return newUser.authenticateUser(authenticationDetails, {
                onSuccess: result => {
                    resolve(result);
                },
                onFailure: err => {
                    reject(err);
                },
            });
        });
        var userDb = await this.userService.findByUsername(userName);
        if (!userDb) {
            const userCreatedResult = await this.userService.syncUserFromCognitoToMongooDb(userName);
            userDb = userCreatedResult;
        }
        return {
            cognitoUserSession: cognitoUserSession,
            user: userDb,
        };
    }
    async signupWpmsUser(wpmsUserRegisterDTO) {
        const wpmsPartner = await this.partnerService.findOne({ name: 'WPMS' });
        if (!wpmsPartner) {
            throw new common_1.NotFoundException('WPMS partner doest not exists, please ask admin to create WPMS partner first before signing up WPMS user');
        }
        var { userName, email, password, phoneNumber = '', country, name, } = wpmsUserRegisterDTO;
        var registerNewUserParams = {
            ClientId: this.authConfig.clientId,
            Username: userName,
            Password: password,
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
        var cognitoUserSignedUp = await this.cognitoIdentityServiceProvider
            .signUp(registerNewUserParams)
            .promise();
        const userCreatedResponse = await this.userService.createOrUpdateUserInDbFromCognitoUserName(cognitoUserSignedUp.UserSub, {
            partner: wpmsPartner._id,
            userRole: Enums_1.SystemRoles.PARTNER_USER,
            country: country,
            name: name,
        });
        return userCreatedResponse;
    }
    async createSonicAdmin() {
        var _a, _b;
        try {
            const createUserDto = {
                userName: this.configService.get('SONIC_ADMIN_USERNAME'),
                name: 'Sonic Admin',
                firstName: 'Sonic Admin',
                password: this.configService.get('SONIC_ADMIN_PASSWORD'),
                email: this.configService.get('SONIC_ADMIN_EMAIL'),
                phoneNumber: this.configService.get('SONIC_ADMIN_PHONE'),
                isEmailVerified: true,
                isPhoneNumberVerified: this.configService.get('SONIC_ADMIN_PHONE')
                    ? true
                    : false,
                userRole: Enums_1.SystemRoles.ADMIN,
                sendInvitationByEmail: false,
            };
            const alreadyUser = await this.userService.findOne({
                username: createUserDto.userName,
                isSonicAdmin: true,
                userRole: Enums_1.SystemRoles.ADMIN,
            });
            if (alreadyUser) {
                console.log('Sonic Admin Present Already');
                return;
            }
            const userCreated = await this.userService.createUserInCognito(createUserDto, true, {
                isSonicAdmin: true,
            });
            await this.userService.adminSetUserPassword((_b = (_a = userCreated === null || userCreated === void 0 ? void 0 : userCreated.cognitoUser) === null || _a === void 0 ? void 0 : _a.User) === null || _b === void 0 ? void 0 : _b.Username, createUserDto.password);
            console.log('Sonic Admin User Created');
        }
        catch (error) {
            console.log("Error creating initial user");
        }
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_config_1.AuthConfig,
        global_aws_service_1.GlobalAwsService,
        user_service_1.UserService,
        partner_service_1.PartnerService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map