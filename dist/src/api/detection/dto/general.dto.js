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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopRadioStationWithPlaysDetails = exports.TopRadioStationWithTopSonicKey = exports.GraphData = exports.PlaysByRadioStationDto = exports.PlaysByTrackDto = exports.PlaysByCountryDto = exports.PlaysByArtistDto = exports.PlaysListResponseDto = exports.PlaysGraphResponseDto = exports.PlaysGraphSingleResponseDto = exports.PlaysCountResponseDto = exports.TopSonicKey = exports.TopRadioStation = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const sonickey_schema_1 = require("../../sonickey/schemas/sonickey.schema");
const radiostation_schema_1 = require("../../radiostation/schemas/radiostation.schema");
class TopRadioStation {
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: false, type: () => String }, totalKeysDetected: { required: false, type: () => Number }, radioStation: { required: true, type: () => require("../../radiostation/schemas/radiostation.schema").RadioStation } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TopRadioStation.prototype, "_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], TopRadioStation.prototype, "totalKeysDetected", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", radiostation_schema_1.RadioStation)
], TopRadioStation.prototype, "radioStation", void 0);
exports.TopRadioStation = TopRadioStation;
;
class TopSonicKey {
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: true, type: () => String }, totalHits: { required: true, type: () => Number }, sonicKey: { required: true, type: () => require("../../sonickey/schemas/sonickey.schema").SonicKey } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TopSonicKey.prototype, "_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], TopSonicKey.prototype, "totalHits", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", sonickey_schema_1.SonicKey)
], TopSonicKey.prototype, "sonicKey", void 0);
exports.TopSonicKey = TopSonicKey;
;
class PlaysCountResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: false, type: () => String }, playsCount: { required: true, type: () => Number }, uniquePlaysCount: { required: true, type: () => Number } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], PlaysCountResponseDto.prototype, "_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysCountResponseDto.prototype, "playsCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysCountResponseDto.prototype, "uniquePlaysCount", void 0);
exports.PlaysCountResponseDto = PlaysCountResponseDto;
;
class PlaysGraphSingleResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: true, type: () => String }, total: { required: true, type: () => Number } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], PlaysGraphSingleResponseDto.prototype, "_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysGraphSingleResponseDto.prototype, "total", void 0);
exports.PlaysGraphSingleResponseDto = PlaysGraphSingleResponseDto;
;
class PlaysGraphResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { playsArtistWise: { required: false, type: () => [require("./general.dto").PlaysGraphSingleResponseDto] }, playsCountryWise: { required: false, type: () => [require("./general.dto").PlaysGraphSingleResponseDto] }, playsSongWise: { required: false, type: () => [require("./general.dto").PlaysGraphSingleResponseDto] }, playsStationWise: { required: false, type: () => [require("./general.dto").PlaysGraphSingleResponseDto] } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], PlaysGraphResponseDto.prototype, "playsArtistWise", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], PlaysGraphResponseDto.prototype, "playsCountryWise", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], PlaysGraphResponseDto.prototype, "playsSongWise", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], PlaysGraphResponseDto.prototype, "playsStationWise", void 0);
exports.PlaysGraphResponseDto = PlaysGraphResponseDto;
;
class PlaysListResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: false, type: () => String }, detectedAt: { required: false, type: () => Date }, owner: { required: false, type: () => String }, channel: { required: false, type: () => String }, detectedDuration: { required: false, type: () => Number }, radioStation: { required: true, type: () => require("../../radiostation/schemas/radiostation.schema").RadioStation }, sonicKey: { required: true, type: () => require("../../sonickey/schemas/sonickey.schema").SonicKey }, createdAt: { required: false, type: () => Date }, updatedAt: { required: false, type: () => Date } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], PlaysListResponseDto.prototype, "_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], PlaysListResponseDto.prototype, "detectedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], PlaysListResponseDto.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], PlaysListResponseDto.prototype, "channel", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysListResponseDto.prototype, "detectedDuration", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", radiostation_schema_1.RadioStation)
], PlaysListResponseDto.prototype, "radioStation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", sonickey_schema_1.SonicKey)
], PlaysListResponseDto.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], PlaysListResponseDto.prototype, "createdAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], PlaysListResponseDto.prototype, "updatedAt", void 0);
exports.PlaysListResponseDto = PlaysListResponseDto;
;
class PlaysByArtistDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { artist: { required: true, type: () => String }, playsCount: { required: true, type: () => Number }, uniquePlaysCount: { required: true, type: () => Number }, radioStationCount: { required: true, type: () => Number }, countriesCount: { required: true, type: () => Number } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], PlaysByArtistDto.prototype, "artist", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByArtistDto.prototype, "playsCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByArtistDto.prototype, "uniquePlaysCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByArtistDto.prototype, "radioStationCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByArtistDto.prototype, "countriesCount", void 0);
exports.PlaysByArtistDto = PlaysByArtistDto;
class PlaysByCountryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { country: { required: true, type: () => String }, playsCount: { required: true, type: () => Number }, uniquePlaysCount: { required: true, type: () => Number }, radioStationCount: { required: true, type: () => Number }, artistsCount: { required: true, type: () => Number } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], PlaysByCountryDto.prototype, "country", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByCountryDto.prototype, "playsCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByCountryDto.prototype, "uniquePlaysCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByCountryDto.prototype, "radioStationCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByCountryDto.prototype, "artistsCount", void 0);
exports.PlaysByCountryDto = PlaysByCountryDto;
class PlaysByTrackDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { trackName: { required: true, type: () => String }, playsCount: { required: true, type: () => Number }, uniquePlaysCount: { required: true, type: () => Number }, radioStationCount: { required: true, type: () => Number }, countriesCount: { required: true, type: () => Number } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], PlaysByTrackDto.prototype, "trackName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByTrackDto.prototype, "playsCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByTrackDto.prototype, "uniquePlaysCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByTrackDto.prototype, "radioStationCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByTrackDto.prototype, "countriesCount", void 0);
exports.PlaysByTrackDto = PlaysByTrackDto;
class PlaysByRadioStationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { radioStation: { required: true, type: () => require("../../radiostation/schemas/radiostation.schema").RadioStation }, playsCount: { required: true, type: () => Number }, uniquePlaysCount: { required: true, type: () => Number }, artistsCount: { required: true, type: () => Number }, countriesCount: { required: true, type: () => Number } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", radiostation_schema_1.RadioStation)
], PlaysByRadioStationDto.prototype, "radioStation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByRadioStationDto.prototype, "playsCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByRadioStationDto.prototype, "uniquePlaysCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByRadioStationDto.prototype, "artistsCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PlaysByRadioStationDto.prototype, "countriesCount", void 0);
exports.PlaysByRadioStationDto = PlaysByRadioStationDto;
class GraphData {
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: true, type: () => Object }, year: { required: true, type: () => Number }, month: { required: true, type: () => Number }, day: { required: true, type: () => Number }, hits: { required: true, type: () => Number } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], GraphData.prototype, "_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], GraphData.prototype, "year", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], GraphData.prototype, "month", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], GraphData.prototype, "day", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], GraphData.prototype, "hits", void 0);
exports.GraphData = GraphData;
class TopRadioStationWithTopSonicKey extends TopRadioStation {
    static _OPENAPI_METADATA_FACTORY() {
        return { sonicKeys: { required: true, type: () => [require("./general.dto").TopSonicKey] }, graphsData: { required: false, type: () => [require("./general.dto").GraphData] } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], TopRadioStationWithTopSonicKey.prototype, "sonicKeys", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], TopRadioStationWithTopSonicKey.prototype, "graphsData", void 0);
exports.TopRadioStationWithTopSonicKey = TopRadioStationWithTopSonicKey;
class TopRadioStationWithPlaysDetails extends TopRadioStation {
    static _OPENAPI_METADATA_FACTORY() {
        return { playsCount: { required: true, type: () => require("./general.dto").PlaysCountResponseDto } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", PlaysCountResponseDto)
], TopRadioStationWithPlaysDetails.prototype, "playsCount", void 0);
exports.TopRadioStationWithPlaysDetails = TopRadioStationWithPlaysDetails;
//# sourceMappingURL=general.dto.js.map