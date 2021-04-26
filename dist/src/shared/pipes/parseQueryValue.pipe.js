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
exports.ParseQueryValue = void 0;
const common_1 = require("@nestjs/common");
let ParseQueryValue = class ParseQueryValue {
    constructor(values) {
        this.values = values;
    }
    transform(queries, metadata) {
        try {
            console.log("queries", queries);
            const res = {};
            for (const key in queries) {
                var value = queries[key];
                var parsedInt = parseInt(value);
                if (!isNaN(parsedInt)) {
                    res[key] = parsedInt;
                }
                else if (value == 'true' || value == 'false') {
                    res[key] = value == 'true';
                }
                else {
                    res[key] = value;
                }
            }
            return res;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
ParseQueryValue = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [Array])
], ParseQueryValue);
exports.ParseQueryValue = ParseQueryValue;
//# sourceMappingURL=parseQueryValue.pipe.js.map