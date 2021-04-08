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
exports.RadioStationSonicKey = void 0;
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const swagger_1 = require("@nestjs/swagger");
let RadioStationSonicKey = class RadioStationSonicKey {
    constructor(data) {
        Object.assign(this, data);
    }
};
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.hashKey({
        indexKeyConfigurations: {
            RadioStationSonicKey_GSI1: 'RANGE',
        },
    }),
    __metadata("design:type", String)
], RadioStationSonicKey.prototype, "radioStation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.rangeKey({
        indexKeyConfigurations: {
            RadioStationSonicKey_GSI1: 'HASH',
        },
    }),
    __metadata("design:type", String)
], RadioStationSonicKey.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", Number)
], RadioStationSonicKey.prototype, "count", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], RadioStationSonicKey.prototype, "owner", void 0);
RadioStationSonicKey = __decorate([
    dynamodb_data_mapper_annotations_1.table('RadioStation-SonicKey'),
    __metadata("design:paramtypes", [Object])
], RadioStationSonicKey);
exports.RadioStationSonicKey = RadioStationSonicKey;
//# sourceMappingURL=radiostationSonickey.schema.js.map