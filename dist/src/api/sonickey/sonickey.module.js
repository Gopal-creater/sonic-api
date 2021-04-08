"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonickeyModule = void 0;
const file_handler_service_1 = require("./../../shared/services/file-handler.service");
const sonickey_repository_1 = require("./../../repositories/sonickey.repository");
const common_1 = require("@nestjs/common");
const sonickey_controller_1 = require("./sonickey.controller");
const sonickey_service_1 = require("./sonickey.service");
const keygen_service_1 = require("../../shared/modules/keygen/keygen.service");
const mongoose_1 = require("@nestjs/mongoose");
const sonickey_schema_1 = require("../../schemas/sonickey.schema");
const file_operation_service_1 = require("../../shared/services/file-operation.service");
let SonickeyModule = class SonickeyModule {
};
SonickeyModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: sonickey_schema_1.SonicKey.name, schema: sonickey_schema_1.SonicKeySchema },
            ]),
        ],
        controllers: [sonickey_controller_1.SonickeyController],
        providers: [
            sonickey_service_1.SonickeyService,
            sonickey_repository_1.SonicKeyRepository,
            keygen_service_1.KeygenService,
            file_operation_service_1.FileOperationService,
            file_handler_service_1.FileHandlerService,
        ],
        exports: [sonickey_service_1.SonickeyService],
    })
], SonickeyModule);
exports.SonickeyModule = SonickeyModule;
//# sourceMappingURL=sonickey.module.js.map