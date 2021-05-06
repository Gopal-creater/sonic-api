"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = exports.parse = void 0;
function parse(data, defaultValue) {
    if (!data) {
        return defaultValue;
    }
    return JSON.parse(data);
}
exports.parse = parse;
function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }
exports.isNumber = isNumber;
//# sourceMappingURL=json.utils.js.map