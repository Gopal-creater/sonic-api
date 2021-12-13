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
exports.SonickeyBinaryController = void 0;
const openapi = require("@nestjs/swagger");
const create_sonickey_dto_1 = require("../dtos/create-sonickey.dto");
const common_1 = require("@nestjs/common");
const sonickey_service_1 = require("../services/sonickey.service");
const swagger_1 = require("@nestjs/swagger");
const Enums_1 = require("../../../constants/Enums");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
const apikey_auth_guard_1 = require("../../api-key/guards/apikey-auth.guard");
const apikey_decorator_1 = require("../../api-key/decorators/apikey.decorator");
const validatedlicense_decorator_1 = require("../../licensekey/decorators/validatedlicense.decorator");
const license_validation_guard_1 = require("../../licensekey/guards/license-validation.guard");
let SonickeyBinaryController = class SonickeyBinaryController {
    constructor(sonicKeyService, licensekeyService) {
        this.sonicKeyService = sonicKeyService;
        this.licensekeyService = licensekeyService;
    }
    async createFormBinary(createSonicKeyDto, customer, apiKey, licenseKey) {
        const channel = Enums_1.ChannelEnums.BINARY;
        const newSonicKey = Object.assign(Object.assign({}, createSonicKeyDto), { owner: customer, apiKey: apiKey, channel: channel, license: licenseKey, _id: createSonicKeyDto.sonicKey });
        const savedSonicKey = await this.sonicKeyService.createFromBinaryForUser(customer, newSonicKey);
        await this.licensekeyService.incrementUses(licenseKey, "encode", 1)
            .catch(async (err) => {
            await this.sonicKeyService.sonicKeyModel.deleteOne({ _id: savedSonicKey.id });
            throw new common_1.BadRequestException('Unable to increment the license usage!');
        });
        return savedSonicKey;
    }
};
__decorate([
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    common_1.Post('/create-from-binary'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Save to database after local encode from binary.' }),
    openapi.ApiResponse({ status: 201, type: require("../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Body()),
    __param(1, apikey_decorator_1.ApiKey('customer')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __param(3, validatedlicense_decorator_1.ValidatedLicense('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyFromBinaryDto, String, String, String]),
    __metadata("design:returntype", Promise)
], SonickeyBinaryController.prototype, "createFormBinary", null);
SonickeyBinaryController = __decorate([
    swagger_1.ApiTags('SonicKeys ThirdParty-Binary Controller (protected by x-api-key)'),
    swagger_1.ApiSecurity('x-api-key'),
    common_1.Controller('sonic-keys/binary'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        licensekey_service_1.LicensekeyService])
], SonickeyBinaryController);
exports.SonickeyBinaryController = SonickeyBinaryController;
//# sourceMappingURL=sonickey.binary.controller.js.map