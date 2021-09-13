"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ACL = exports.ApiKeyType = exports.Roles = exports.Permissions = exports.ChannelEnums = void 0;
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
var S3ACL;
(function (S3ACL) {
    S3ACL["PRIVATE"] = "private";
    S3ACL["PUBLIC_READ"] = "public-read";
    S3ACL["PUBLIC_READ_WRITE"] = "public-read-write";
    S3ACL["AUTHENTICATED_READ"] = "authenticated-read";
    S3ACL["BUCKET_OWNER_READ"] = "bucket-owner-read";
    S3ACL["BUCKET_OWNER_FULL_CONTROL"] = "bucket-owner-full-control";
})(S3ACL = exports.S3ACL || (exports.S3ACL = {}));
//# sourceMappingURL=Enums.js.map