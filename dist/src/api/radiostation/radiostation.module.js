"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiostationModule = void 0;
const common_1 = require("@nestjs/common");
const radiostation_service_1 = require("./services/radiostation.service");
const radiostation_controller_1 = require("./controllers/radiostation.controller");
const radiostation_repository_1 = require("../../repositories/radiostation.repository");
const radiostation_sonickeys_controller_1 = require("./controllers/radiostation-sonickeys.controller");
const radiostation_sonickeys_service_1 = require("./services/radiostation-sonickeys.service");
const radiostationSonickey_repository_1 = require("../../repositories/radiostationSonickey.repository");
let RadiostationModule = class RadiostationModule {
};
RadiostationModule = __decorate([
    common_1.Module({
        controllers: [radiostation_controller_1.RadiostationController, radiostation_sonickeys_controller_1.RadiostationSonicKeysController],
        providers: [radiostation_service_1.RadiostationService, radiostation_sonickeys_service_1.RadiostationSonicKeysService, radiostation_repository_1.RadioStationRepository, radiostationSonickey_repository_1.RadioStationSonicKeyRepository]
    })
], RadiostationModule);
exports.RadiostationModule = RadiostationModule;
//# sourceMappingURL=radiostation.module.js.map