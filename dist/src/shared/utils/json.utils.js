"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
function parse(data, defaultValue) {
    if (!data) {
        return defaultValue;
    }
    return JSON.parse(data);
}
exports.parse = parse;
//# sourceMappingURL=json.utils.js.map