"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyType = exports.Roles = exports.Permissions = exports.ChannelEnums = void 0;
var ChannelEnums;
(function (ChannelEnums) {
    ChannelEnums["JOB"] = "JOB";
    ChannelEnums["PCAPP"] = "PCAPP";
    ChannelEnums["BINARY"] = "BINARY";
    ChannelEnums["PORTAL"] = "PORTAL";
    ChannelEnums["MOBILEAPP"] = "MOBILEAPP";
    ChannelEnums["HARDWARE"] = "HARDWARE";
    ChannelEnums["RADIOSTATION"] = "RADIOSTATION";
})(ChannelEnums = exports.ChannelEnums || (exports.ChannelEnums = {}));
var Permissions;
(function (Permissions) {
    Permissions[Permissions["MANAGE"] = 1] = "MANAGE";
})(Permissions = exports.Permissions || (exports.Permissions = {}));
var Roles;
(function (Roles) {
    Roles["ADMIN"] = "Admin";
})(Roles = exports.Roles || (exports.Roles = {}));
var ApiKeyType;
(function (ApiKeyType) {
    ApiKeyType["INDIVIDUAL"] = "Individual";
    ApiKeyType["GROUP"] = "Group";
})(ApiKeyType = exports.ApiKeyType || (exports.ApiKeyType = {}));
//# sourceMappingURL=Enums.js.map