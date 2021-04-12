"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCatDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const cat_schema_1 = require("../schemas/cat.schema");
class CreateCatDto extends swagger_1.OmitType(cat_schema_1.Cat, [
    'startedAt',
    'stopAt',
    'isStreamStarted'
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateCatDto = CreateCatDto;
//# sourceMappingURL=create-cat.dto.js.map