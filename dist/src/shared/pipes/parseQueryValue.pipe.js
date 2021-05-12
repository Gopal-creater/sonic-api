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
const mongoose_query_parser_1 = require("mongoose-query-parser");
let ParseQueryValue = class ParseQueryValue {
    constructor(values) {
        this.values = values;
    }
    transform(queries, metadata) {
        var _a, _b, _c;
        try {
            const parser = new mongoose_query_parser_1.MongooseQueryParser();
            queries = queries || {};
            const queryToParse = Object.assign({ page: 1 }, queries);
            var parsed = parser.parse(queryToParse);
            parsed = Object.assign({ limit: 100, skip: 0 }, parsed);
            if ((_a = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _a === void 0 ? void 0 : _a.page) {
                parsed['page'] = (_b = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _b === void 0 ? void 0 : _b.page;
                (_c = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _c === void 0 ? true : delete _c.page;
            }
            return parsed;
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