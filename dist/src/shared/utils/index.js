"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumToArrayOfObject = exports.getInstanceDetailsForMetaData = exports.getInstanceMetaData = exports.isValidHttpUrl = exports.extractFileName = exports.promiseHandler = exports.isValidUUID = exports.JSONUtils = void 0;
exports.JSONUtils = require("./json.utils");
const axios_1 = require("axios");
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
function isValidHttpUrl(string) {
    let url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
}
exports.isValidHttpUrl = isValidHttpUrl;
function getInstanceMetaData() {
    return axios_1.default
        .get('http://169.254.169.254/latest/meta-data/')
        .then(res => {
        return res.data;
    });
}
exports.getInstanceMetaData = getInstanceMetaData;
function getInstanceDetailsForMetaData(metadata) {
    return axios_1.default
        .get(`http://169.254.169.254/latest/meta-data/${metadata}`)
        .then(res => {
        return res.data;
    });
}
exports.getInstanceDetailsForMetaData = getInstanceDetailsForMetaData;
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