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
exports.ConvertIntObj = void 0;
const common_1 = require("@nestjs/common");
let ConvertIntObj = class ConvertIntObj {
    constructor(values) {
        this.values = values;
    }
    transform(value, metadata) {
        try {
            console.log("value", value);
            console.log("this.values", this.values);
            return convertIntObj(value, this.values);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
ConvertIntObj = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [Array])
], ConvertIntObj);
exports.ConvertIntObj = ConvertIntObj;
function convertIntObj(obj, value) {
    const res = {};
    for (const key in obj) {
        if (value.includes(key)) {
            const parsed = parseInt(obj[key]);
            res[key] = isNaN(parsed) ? obj[key] : parsed;
        }
        else {
            res[key] = obj[key];
        }
    }
    return res;
}
//# sourceMappingURL=convertIntObj.pipe.js.map