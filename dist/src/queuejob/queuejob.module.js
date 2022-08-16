"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuejobModule = void 0;
const common_1 = require("@nestjs/common");
const queuejob_service_1 = require("./queuejob.service");
const queuejob_controller_1 = require("./queuejob.controller");
const mongoose_1 = require("@nestjs/mongoose");
const queuejob_schema_1 = require("./schemas/queuejob.schema");
let QueuejobModule = class QueuejobModule {
};
QueuejobModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: queuejob_schema_1.QueueJobSchemaName, schema: queuejob_schema_1.QueueJobSchema },
            ]),
        ],
        controllers: [queuejob_controller_1.QueuejobController],
        providers: [queuejob_service_1.QueuejobService],
        exports: [queuejob_service_1.QueuejobService]
    })
], QueuejobModule);
exports.QueuejobModule = QueuejobModule;
//# sourceMappingURL=queuejob.module.js.map