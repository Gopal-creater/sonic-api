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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseQueryValue = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const mongoose_query_parser_1 = require("mongoose-query-parser");
const mongoose_utils_1 = require("../utils/mongoose.utils");
let ParseQueryValue = class ParseQueryValue {
    constructor(values) {
        this.values = values;
    }
    transform(queries = {}, metadata) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        try {
            const { aggregateSearch } = queries, query = __rest(queries, ["aggregateSearch"]);
            const parser = new mongoose_query_parser_1.MongooseQueryParser();
            const queryToParse = Object.assign({ page: 1 }, query);
            var parsed = parser.parse(queryToParse);
            parsed = Object.assign({ limit: 50, skip: 0 }, parsed);
            if ((_a = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _a === void 0 ? void 0 : _a.page) {
                parsed['page'] = (_b = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _b === void 0 ? void 0 : _b.page;
                (_c = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _c === void 0 ? true : delete _c.page;
            }
            if (aggregateSearch) {
                const parsedAggregate = JSON.parse(aggregateSearch);
                if (!lodash_1.isArray(parsedAggregate)) {
                    throw new common_1.BadRequestException("aggregateSearch params must be an array of object type in stringify format");
                }
                console.log("passed========>");
                if (parsedAggregate.some(e => typeof (e) != 'object')) {
                    throw new common_1.BadRequestException("aggregateSearch params must be an array of object type in stringify format");
                }
                parsed['aggregateSearch'] = parsedAggregate;
            }
            if ((_d = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _d === void 0 ? void 0 : _d.topLimit) {
                parsed['topLimit'] = (_e = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _e === void 0 ? void 0 : _e.topLimit;
                (_f = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _f === void 0 ? true : delete _f.topLimit;
            }
            if (((_g = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _g === void 0 ? void 0 : _g.includeGraph) !== null || ((_h = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _h === void 0 ? void 0 : _h.includeGraph) !== undefined) {
                parsed['includeGraph'] = (_j = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _j === void 0 ? void 0 : _j.includeGraph;
                (_k = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _k === void 0 ? true : delete _k.includeGraph;
            }
            if (((_l = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _l === void 0 ? void 0 : _l.includeGroupData) !== null || ((_m = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _m === void 0 ? void 0 : _m.includeGroupData) !== undefined) {
                parsed['includeGroupData'] = (_o = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _o === void 0 ? void 0 : _o.includeGroupData;
                (_p = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _p === void 0 ? true : delete _p.includeGroupData;
            }
            if ((_q = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _q === void 0 ? void 0 : _q.groupByTime) {
                parsed['groupByTime'] = (_r = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _r === void 0 ? void 0 : _r.groupByTime;
                (_s = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _s === void 0 ? true : delete _s.groupByTime;
            }
            if (parsed === null || parsed === void 0 ? void 0 : parsed.filter) {
                console.log("filter", parsed === null || parsed === void 0 ? void 0 : parsed.filter);
                parsed.filter = this.castToObjectId(parsed === null || parsed === void 0 ? void 0 : parsed.filter);
            }
            console.log('parsed', JSON.stringify(parsed));
            console.log('parsed filter', parsed.filter);
            return parsed;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    castToObjectId(filter) {
        const res = {};
        for (const key in filter) {
            var value = filter[key];
            console.log(`IsObjectId ${mongoose_utils_1.isObjectId(value)} :${value}`);
            if (mongoose_utils_1.isObjectId(value)) {
                res[key] = mongoose_utils_1.toObjectId(value);
            }
            else {
                res[key] = value;
            }
        }
        return res;
    }
};
ParseQueryValue = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [Array])
], ParseQueryValue);
exports.ParseQueryValue = ParseQueryValue;
//# sourceMappingURL=parseQueryValue.pipe.js.map