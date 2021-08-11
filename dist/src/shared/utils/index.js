"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUUID = void 0;
exports.JSONUtils = require("./json.utils");
function isValidUUID(str) {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(str);
}
exports.isValidUUID = isValidUUID;
//# sourceMappingURL=index.js.map