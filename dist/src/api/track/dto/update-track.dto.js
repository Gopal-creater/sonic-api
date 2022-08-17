"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTrackDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_track_dto_1 = require("./create-track.dto");
class UpdateTrackDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_track_dto_1.TrackDto, ['apiKey', 'license', 'createdByUser'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTrackDto = UpdateTrackDto;
//# sourceMappingURL=update-track.dto.js.map