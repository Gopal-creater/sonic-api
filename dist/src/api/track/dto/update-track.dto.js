"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTrackDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_track_dto_1 = require("./create-track.dto");
class UpdateTrackDto extends mapped_types_1.PartialType(mapped_types_1.OmitType(create_track_dto_1.TrackDto, ['apiKey', 'channel', 'channelUuid', 'company', 'owner', 'partner', 'artist', 'title'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTrackDto = UpdateTrackDto;
//# sourceMappingURL=update-track.dto.js.map