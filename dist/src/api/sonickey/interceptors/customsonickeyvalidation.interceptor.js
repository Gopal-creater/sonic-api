"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSonicKeyValidationInterceptor = void 0;
const common_1 = require("@nestjs/common");
let CustomSonicKeyValidationInterceptor = class CustomSonicKeyValidationInterceptor {
    intercept(context, next) {
        try {
            const req = context.switchToHttp().getRequest();
            console.log("req", req);
            const data = req.body['data'];
            console.log("data", data);
            if (!data)
                throw new common_1.BadRequestException("data can not be empty");
            const sonicKeyDto = JSON.parse(data);
            if (!sonicKeyDto.contentOwner)
                throw new common_1.BadRequestException({ message: ["contentOwner can not be empty"] });
            throw new common_1.BadRequestException("Done Error");
            return next
                .handle();
        }
        catch (error) {
            throw new common_1.BadRequestException("Validation Failed");
        }
    }
};
CustomSonicKeyValidationInterceptor = __decorate([
    common_1.Injectable()
], CustomSonicKeyValidationInterceptor);
exports.CustomSonicKeyValidationInterceptor = CustomSonicKeyValidationInterceptor;
//# sourceMappingURL=customsonickeyvalidation.interceptor.js.map