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
exports.RadioStationListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const constants_1 = require("./constants");
const radiostation_schema_1 = require("../../../schemas/radiostation.schema");
let RadioStationListener = class RadioStationListener {
    handleStartListeningEvent(event) {
        console.log(event);
    }
    handleStopListeningEvent(event) {
        console.log(event);
    }
};
__decorate([
    event_emitter_1.OnEvent(constants_1.START_LISTENING),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [radiostation_schema_1.RadioStation]),
    __metadata("design:returntype", void 0)
], RadioStationListener.prototype, "handleStartListeningEvent", null);
__decorate([
    event_emitter_1.OnEvent(constants_1.STOP_LISTENING),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [radiostation_schema_1.RadioStation]),
    __metadata("design:returntype", void 0)
], RadioStationListener.prototype, "handleStopListeningEvent", null);
RadioStationListener = __decorate([
    common_1.Injectable()
], RadioStationListener);
exports.RadioStationListener = RadioStationListener;
//# sourceMappingURL=radiostation.listener.js.map