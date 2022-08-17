"use strict";
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
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const mongoose_query_parser_1 = require("mongoose-query-parser");
const mongoose_utils_1 = require("./mongoose.utils");
function parsedQueryValueFromQuery(queries) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    try {
        queries = queries || {};
        const { aggregateSearch, relation_filter = JSON.stringify({}) } = queries, query = __rest(queries, ["aggregateSearch", "relation_filter"]);
        const parser = new mongoose_query_parser_1.MongooseQueryParser();
        const relationPrefix = 'relation_';
        const queryToParse = Object.assign({ page: 1 }, query);
        var parsed = parser.parse(queryToParse);
        parsed = Object.assign({ limit: 50, skip: 0 }, parsed);
        const relationalFilter = JSON.parse(relation_filter) || {};
        const objKeysArr = Object.keys(parsed.filter);
        for (let index = 0; index < objKeysArr.length; index++) {
            const filterFiled = objKeysArr[index];
            console.log('filterFiled', filterFiled);
            if (filterFiled.includes(relationPrefix)) {
                relationalFilter[filterFiled.split(relationPrefix)[1]] =
                    parsed.filter[filterFiled];
                delete parsed.filter[filterFiled];
            }
        }
        parsed['relationalFilter'] = relationalFilter;
        if ((_a = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _a === void 0 ? void 0 : _a.page) {
            parsed['page'] = (_b = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _b === void 0 ? void 0 : _b.page;
            (_c = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _c === void 0 ? true : delete _c.page;
        }
        if (aggregateSearch) {
            const parsedAggregate = JSON.parse(aggregateSearch);
            if (!(0, lodash_1.isArray)(parsedAggregate)) {
                throw new common_1.BadRequestException('aggregateSearch params must be an array of object type in stringify format');
            }
            console.log('passed========>');
            if (parsedAggregate.some(e => typeof e != 'object')) {
                throw new common_1.BadRequestException('aggregateSearch params must be an array of object type in stringify format');
            }
            parsed['aggregateSearch'] = parsedAggregate;
        }
        if ((_d = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _d === void 0 ? void 0 : _d.topLimit) {
            parsed['topLimit'] = (_e = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _e === void 0 ? void 0 : _e.topLimit;
            (_f = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _f === void 0 ? true : delete _f.topLimit;
        }
        if (((_g = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _g === void 0 ? void 0 : _g.includeGraph) !== null ||
            ((_h = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _h === void 0 ? void 0 : _h.includeGraph) !== undefined) {
            parsed['includeGraph'] = (_j = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _j === void 0 ? void 0 : _j.includeGraph;
            (_k = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _k === void 0 ? true : delete _k.includeGraph;
        }
        if (((_l = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _l === void 0 ? void 0 : _l.recentPlays) !== null ||
            ((_m = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _m === void 0 ? void 0 : _m.recentPlays) !== undefined) {
            parsed['recentPlays'] = (_o = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _o === void 0 ? void 0 : _o.recentPlays;
            (_p = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _p === void 0 ? true : delete _p.recentPlays;
        }
        if (((_q = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _q === void 0 ? void 0 : _q.includeGroupData) !== null ||
            ((_r = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _r === void 0 ? void 0 : _r.includeGroupData) !== undefined) {
            parsed['includeGroupData'] = (_s = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _s === void 0 ? void 0 : _s.includeGroupData;
            (_t = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _t === void 0 ? true : delete _t.includeGroupData;
        }
        if ((_u = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _u === void 0 ? void 0 : _u.groupByTime) {
            parsed['groupByTime'] = (_v = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _v === void 0 ? void 0 : _v.groupByTime;
            (_w = parsed === null || parsed === void 0 ? void 0 : parsed.filter) === null || _w === void 0 ? true : delete _w.groupByTime;
        }
        if (parsed === null || parsed === void 0 ? void 0 : parsed.filter) {
            parsed.filter = castToObjectId(parsed === null || parsed === void 0 ? void 0 : parsed.filter);
        }
        if (parsed === null || parsed === void 0 ? void 0 : parsed['relationalFilter']) {
            parsed['relationalFilter'] = castToObjectId(parsed['relationalFilter']);
        }
        console.log('parsed', JSON.stringify(parsed));
        console.log('parsed filter', parsed.filter);
        console.log('parsed relation filter', parsed['relationalFilter']);
        return parsed;
    }
    catch (error) {
        throw new common_1.BadRequestException(error);
    }
}
exports.default = parsedQueryValueFromQuery;
function castToObjectId(filter) {
    const res = {};
    for (const key in filter) {
        var value = filter[key];
        console.log(`IsObjectId ${(0, mongoose_utils_1.isObjectId)(value)} :${value}`);
        if ((0, mongoose_utils_1.isObjectId)(value)) {
            res[key] = (0, mongoose_utils_1.toObjectId)(value);
        }
        else {
            res[key] = value;
        }
    }
    return res;
}
//# sourceMappingURL=parsedQueryValueFromQuery.js.map