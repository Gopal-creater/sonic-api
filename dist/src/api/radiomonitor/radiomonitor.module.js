"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiomonitorModule = void 0;
const common_1 = require("@nestjs/common");
const radiomonitor_service_1 = require("./radiomonitor.service");
const radiomonitor_controller_1 = require("./controllers/radiomonitor.controller");
const mongoose_1 = require("@nestjs/mongoose");
const radiomonitor_schema_1 = require("./schemas/radiomonitor.schema");
const radiostation_module_1 = require("../radiostation/radiostation.module");
const radiomonitor_owner_controller_1 = require("./controllers/radiomonitor-owner.controller");
const licensekey_module_1 = require("../licensekey/licensekey.module");
let RadiomonitorModule = class RadiomonitorModule {
};
RadiomonitorModule = __decorate([
    common_1.Module({
        imports: [
            licensekey_module_1.LicensekeyModule,
            common_1.forwardRef(() => radiostation_module_1.RadiostationModule),
            mongoose_1.MongooseModule.forFeature([
                { name: radiomonitor_schema_1.RadioMonitorSchemaName, schema: radiomonitor_schema_1.RadioMonitorSchema },
            ]),
        ],
        controllers: [radiomonitor_controller_1.RadioMonitorController, radiomonitor_owner_controller_1.RadioMonitorOwnerController],
        providers: [radiomonitor_service_1.RadioMonitorService],
        exports: [radiomonitor_service_1.RadioMonitorService]
    })
], RadiomonitorModule);
exports.RadiomonitorModule = RadiomonitorModule;
//# sourceMappingURL=radiomonitor.module.js.map