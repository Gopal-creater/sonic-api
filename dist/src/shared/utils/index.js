"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumToArrayOfObject = exports.isValidHttpUrl = exports.extractFileName = exports.promiseHandler = exports.isValidUUID = exports.JSONUtils = void 0;
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
    url = url.includes('?') ? url.split('?')[0] : url;
    if (isValidHttpUrl(url)) {
        const newUrl = new URL(url);
        const { pathname } = newUrl;
        const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
        return filename;
    }
    else {
        const filename = url.substring(url.lastIndexOf('/') + 1);
        return filename;
    }
}
exports.extractFileName = extractFileName;
function isValidHttpUrl(string) {
    try {
        let url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    }
    catch (error) {
        return false;
    }
}
exports.isValidHttpUrl = isValidHttpUrl;
function enumToArrayOfObject(e) {
    const arrayObjects = [];
    for (const [propertyKey, propertyValue] of Object.entries(e)) {
        if (!Number.isNaN(Number(propertyKey))) {
            continue;
        }
        arrayObjects.push({ key: propertyKey, value: propertyValue });
    }
    return arrayObjects;
}
exports.enumToArrayOfObject = enumToArrayOfObject;
//# sourceMappingURL=index.js.map