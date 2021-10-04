"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalAwsModule = void 0;
const global_aws_service_1 = require("./global-aws.service");
const common_1 = require("@nestjs/common");
let GlobalAwsModule = class GlobalAwsModule {
};
GlobalAwsModule = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [],
        providers: [global_aws_service_1.GlobalAwsService],
        exports: [global_aws_service_1.GlobalAwsService]
    })
], GlobalAwsModule);
exports.GlobalAwsModule = GlobalAwsModule;
//# sourceMappingURL=global-auth.module.js.map