"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdpartyDetectionModule = void 0;
const common_1 = require("@nestjs/common");
const thirdparty_detection_service_1 = require("./thirdparty-detection.service");
const thirdparty_detection_controller_1 = require("./thirdparty-detection.controller");
const mongoose_1 = require("@nestjs/mongoose");
const thirdparty_detection_schema_1 = require("./schemas/thirdparty-detection.schema");
let ThirdpartyDetectionModule = class ThirdpartyDetectionModule {
};
ThirdpartyDetectionModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: thirdparty_detection_schema_1.ThirdpartyDetectionSchemaName,
                    schema: thirdparty_detection_schema_1.ThirdpartyDetectionSchema,
                },
            ]),
        ],
        controllers: [thirdparty_detection_controller_1.ThirdpartyDetectionController],
        providers: [thirdparty_detection_service_1.ThirdpartyDetectionService],
    })
], ThirdpartyDetectionModule);
exports.ThirdpartyDetectionModule = ThirdpartyDetectionModule;
//# sourceMappingURL=thirdparty-detection.module.js.map