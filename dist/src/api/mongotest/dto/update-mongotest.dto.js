"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMongotestDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_mongotest_dto_1 = require("./create-mongotest.dto");
class UpdateMongotestDto extends mapped_types_1.PartialType(create_mongotest_dto_1.CreateMongotestDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMongotestDto = UpdateMongotestDto;
//# sourceMappingURL=update-mongotest.dto.js.map