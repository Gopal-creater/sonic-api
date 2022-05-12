"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyDestinationFolderAndResourceOwnerFromUser = exports.enumToArrayOfObject = exports.isValidHttpUrl = exports.extractFileName = exports.promiseHandler = exports.isValidUUID = exports.JSONUtils = void 0;
exports.JSONUtils = require("./json.utils");
const Enums_1 = require("../../constants/Enums");
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
function identifyDestinationFolderAndResourceOwnerFromUser(user, keyNameForOwner = "owner", keyNameForPartner = "partner", keyNameForCompany = "company") {
    var _a, _b, _c, _d;
    var destinationFolder;
    var resourceOwnerObj;
    switch (user.userRole) {
        case Enums_1.SystemRoles.COMPANY_USER:
        case Enums_1.SystemRoles.COMPANY_ADMIN:
            if (user.company) {
                destinationFolder = `companies/${(_a = user.company) === null || _a === void 0 ? void 0 : _a._id}`;
                resourceOwnerObj[keyNameForCompany] = (_b = user.company) === null || _b === void 0 ? void 0 : _b._id;
            }
            break;
        case Enums_1.SystemRoles.PARTNER_USER:
        case Enums_1.SystemRoles.PARTNER_ADMIN:
            if (user.partner) {
                destinationFolder = `partners/${(_c = user.partner) === null || _c === void 0 ? void 0 : _c._id}`;
                resourceOwnerObj[keyNameForPartner] = (_d = user.partner) === null || _d === void 0 ? void 0 : _d._id;
            }
            break;
        default:
            destinationFolder = `${user === null || user === void 0 ? void 0 : user.sub}`;
            resourceOwnerObj[keyNameForOwner] = user === null || user === void 0 ? void 0 : user.sub;
            break;
    }
    return {
        destinationFolder: destinationFolder,
        resourceOwnerObj: resourceOwnerObj
    };
}
exports.identifyDestinationFolderAndResourceOwnerFromUser = identifyDestinationFolderAndResourceOwnerFromUser;
//# sourceMappingURL=index.js.map