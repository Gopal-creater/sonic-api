"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFileName = exports.promiseHandler = exports.isValidUUID = exports.JSONUtils = void 0;
exports.JSONUtils = require("./json.utils");
function isValidUUID(str) {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(str);
}
exports.isValidUUID = isValidUUID;
function promiseHandler(promise) {
    return promise
        .then((data) => Promise.resolve([data, undefined]))
        .catch((error) => Promise.resolve([undefined, error]));
}
exports.promiseHandler = promiseHandler;
function extractFileName(url) {
    var filename = url.substring(url.lastIndexOf('/') + 1);
    return filename;
}
exports.extractFileName = extractFileName;
//# sourceMappingURL=index.js.map