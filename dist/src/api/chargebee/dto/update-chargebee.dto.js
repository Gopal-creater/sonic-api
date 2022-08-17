"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChargebeeDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_chargebee_dto_1 = require("./create-chargebee.dto");
class UpdateChargebeeDto extends (0, mapped_types_1.PartialType)(create_chargebee_dto_1.CreateChargebeeDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateChargebeeDto = UpdateChargebeeDto;
//# sourceMappingURL=update-chargebee.dto.js.map