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
const mongoose_1 = require("@nestjs/mongoose");
const radiostation_schema_1 = require("./schemas/radiostation.schema");
const sonickey_module_1 = require("../sonickey/sonickey.module");
const detection_module_1 = require("../detection/detection.module");
const radiostation_listener_1 = require("./listeners/radiostation.listener");
const radiomonitor_module_1 = require("../radiomonitor/radiomonitor.module");
let RadiostationModule = class RadiostationModule {
};
RadiostationModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: radiostation_schema_1.RadioStationSchemaName, schema: radiostation_schema_1.RadioStationSchema }
            ]),
            sonickey_module_1.SonickeyModule,
            common_1.forwardRef(() => radiomonitor_module_1.RadiomonitorModule),
            detection_module_1.DetectionModule
        ],
        controllers: [radiostation_controller_1.RadiostationController],
        providers: [
            radiostation_service_1.RadiostationService,
            radiostation_listener_1.RadioStationListener,
        ],
        exports: [radiostation_service_1.RadiostationService]
    })
], RadiostationModule);
exports.RadiostationModule = RadiostationModule;
//# sourceMappingURL=radiostation.module.js.map