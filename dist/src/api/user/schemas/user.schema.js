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
exports.UserSession = exports.UserAttributesObj = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserAttributesObj {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UserAttributesObj.prototype, "sub", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], UserAttributesObj.prototype, "cognito:groups", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], UserAttributesObj.prototype, "email_verified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], UserAttributesObj.prototype, "phone_number_verified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UserAttributesObj.prototype, "phone_number", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UserAttributesObj.prototype, "email", void 0);
exports.UserAttributesObj = UserAttributesObj;
class UserSession {
}
exports.UserSession = UserSession;
//# sourceMappingURL=user.schema.js.map