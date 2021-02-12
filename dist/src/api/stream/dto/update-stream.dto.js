"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStreamDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_stream_dto_1 = require("./create-stream.dto");
class UpdateStreamDto extends mapped_types_1.PartialType(create_stream_dto_1.CreateStreamDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateStreamDto = UpdateStreamDto;
//# sourceMappingURL=update-stream.dto.js.map