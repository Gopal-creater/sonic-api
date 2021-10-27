"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EC2InstanceMetadata = exports.S3ACL = exports.ApiKeyType = exports.Roles = exports.Permissions = exports.ChannelEnums = void 0;
var ChannelEnums;
(function (ChannelEnums) {
    ChannelEnums["JOB"] = "JOB";
    ChannelEnums["PCAPP"] = "PCAPP";
    ChannelEnums["BINARY"] = "BINARY";
    ChannelEnums["PORTAL"] = "PORTAL";
    ChannelEnums["MOBILEAPP"] = "MOBILEAPP";
    ChannelEnums["HARDWARE"] = "HARDWARE";
    ChannelEnums["RADIOSTATION"] = "RADIOSTATION";
    ChannelEnums["STREAMREADER"] = "STREAMREADER";
    ChannelEnums["THIRDPARTY"] = "THIRDPARTY";
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
var EC2InstanceMetadata;
(function (EC2InstanceMetadata) {
    EC2InstanceMetadata["ami_id"] = "ami-id";
    EC2InstanceMetadata["hostname"] = "hostname";
    EC2InstanceMetadata["instance_id"] = "instance-id";
    EC2InstanceMetadata["instance_type"] = "instance-id";
    EC2InstanceMetadata["local_hostname"] = "local-hostname";
    EC2InstanceMetadata["local_ipv4"] = "local-ipv4";
    EC2InstanceMetadata["mac"] = "mac";
    EC2InstanceMetadata["public_hostname"] = "public-hostname";
    EC2InstanceMetadata["public_ipv4"] = "public-ipv4";
})(EC2InstanceMetadata = exports.EC2InstanceMetadata || (exports.EC2InstanceMetadata = {}));
//# sourceMappingURL=Enums.js.map