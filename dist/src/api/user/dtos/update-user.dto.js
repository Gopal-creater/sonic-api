"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_user_dto_1 = require("./create-user.dto");
class UpdateUserDto extends mapped_types_1.PartialType(mapped_types_1.OmitType(create_user_dto_1.CreateUserDto, ['userName', 'email', 'isEmailVerified', 'isPhoneNumberVerified', 'sendInvitationByEmail'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map