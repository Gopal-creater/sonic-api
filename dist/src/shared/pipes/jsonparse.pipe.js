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
exports.JsonParsePipe = void 0;
const common_1 = require("@nestjs/common");
let JsonParsePipe = class JsonParsePipe {
    constructor(field) {
        this.field = field;
    }
    transform(value, metadata) {
        try {
            console.log("JsonParsePipe-value", value);
            const data = this.field ? value[this.field] : value;
            return data && JSON.parse(data);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
JsonParsePipe = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [String])
], JsonParsePipe);
exports.JsonParsePipe = JsonParsePipe;
//# sourceMappingURL=jsonparse.pipe.js.map