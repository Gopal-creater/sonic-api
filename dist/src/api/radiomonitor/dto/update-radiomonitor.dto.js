"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRadioMonitorDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_radiomonitor_dto_1 = require("./create-radiomonitor.dto");
class UpdateRadioMonitorDto extends (0, mapped_types_1.PartialType)(create_radiomonitor_dto_1.CreateRadioMonitorDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateRadioMonitorDto = UpdateRadioMonitorDto;
//# sourceMappingURL=update-radiomonitor.dto.js.map