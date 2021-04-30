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
exports.CreateRadiostationSonicKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const radiostation_sonickey_schema_1 = require("../../schemas/radiostation-sonickey.schema");
class CreateRadiostationSonicKeyDto extends swagger_1.OmitType(radiostation_sonickey_schema_1.RadioStationSonicKey, ['radioStation', 'sonicKey']) {
    static _OPENAPI_METADATA_FACTORY() {
        return { sonicKey: { required: true, type: () => String }, radioStation: { required: true, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateRadiostationSonicKeyDto.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateRadiostationSonicKeyDto.prototype, "radioStation", void 0);
exports.CreateRadiostationSonicKeyDto = CreateRadiostationSonicKeyDto;
//# sourceMappingURL=create-radiostation-sonickey.dto.js.map