"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationInterceptor = void 0;
const soniccontent_schema_1 = require("../../schemas/soniccontent.schema");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let ValidationInterceptor = class ValidationInterceptor {
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        console.log("request", request);
        const validateO = new soniccontent_schema_1.SonicContent();
        validateO.volatileMetadata.contentName = "Test";
        try {
            return next.handle();
        }
        catch (err) {
            rxjs_1.throwError(new common_1.NotFoundException(err));
        }
    }
};
ValidationInterceptor = __decorate([
    common_1.Injectable()
], ValidationInterceptor);
exports.ValidationInterceptor = ValidationInterceptor;
//# sourceMappingURL=validation.interceptor.js.map