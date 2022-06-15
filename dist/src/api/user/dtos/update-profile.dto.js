"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./create-user.dto");
class UpdateProfileDto extends swagger_1.PartialType(swagger_1.OmitType(create_user_dto_1.CreateUserDto, ['userName', 'email', 'sendInvitationByEmail', 'isEmailVerified', 'isPhoneNumberVerified', 'partner', 'company', 'password', 'userRole'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateProfileDto = UpdateProfileDto;
//# sourceMappingURL=update-profile.dto.js.map