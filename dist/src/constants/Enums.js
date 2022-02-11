"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = exports.EC2InstanceMetadata = exports.SystemGroup = exports.Roles = exports.MonitorGroupsEnum = exports.S3ACL = exports.ApiKeyType = exports.Permissions = exports.ChannelEnums = void 0;
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
    ChannelEnums["THIRDPARTY_STREAMREADER"] = "THIRDPARTY_STREAMREADER";
    ChannelEnums["THIRDPARTY"] = "THIRDPARTY";
})(ChannelEnums = exports.ChannelEnums || (exports.ChannelEnums = {}));
var Permissions;
(function (Permissions) {
    Permissions[Permissions["MANAGE"] = 1] = "MANAGE";
})(Permissions = exports.Permissions || (exports.Permissions = {}));
var ApiKeyType;
(function (ApiKeyType) {
    ApiKeyType["INDIVIDUAL"] = "Individual";
    ApiKeyType["COMPANY"] = "Company";
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
var MonitorGroupsEnum;
(function (MonitorGroupsEnum) {
    MonitorGroupsEnum["AIM"] = "AIM";
    MonitorGroupsEnum["AFEM"] = "AFEM";
})(MonitorGroupsEnum = exports.MonitorGroupsEnum || (exports.MonitorGroupsEnum = {}));
var Roles;
(function (Roles) {
    Roles["ADMIN"] = "Admin";
    Roles["AIM"] = "AIM";
    Roles["AFEM"] = "AFEM";
    Roles["PORTAL_USER"] = "PortalUser";
    Roles["WPMS_USER"] = "WPMSUser";
    Roles["COMPANY_ADMIN"] = "CompanyAdmin";
    Roles["THIRDPARTY_ADMIN"] = "ThirdPartyAdmin";
})(Roles = exports.Roles || (exports.Roles = {}));
var SystemGroup;
(function (SystemGroup) {
    SystemGroup["ADMIN"] = "Admin";
    SystemGroup["PORTAL_USER"] = "PortalUser";
    SystemGroup["AIM"] = "AIM";
    SystemGroup["AFEM"] = "AFEM";
    SystemGroup["WPMS_USER"] = "WPMSUser";
    SystemGroup["COMPANY_ADMIN"] = "CompanyAdmin";
})(SystemGroup = exports.SystemGroup || (exports.SystemGroup = {}));
var EC2InstanceMetadata;
(function (EC2InstanceMetadata) {
    EC2InstanceMetadata["ami_id"] = "ami-id";
    EC2InstanceMetadata["hostname"] = "hostname";
    EC2InstanceMetadata["instance_id"] = "instance-id";
    EC2InstanceMetadata["instance_type"] = "instance-type";
    EC2InstanceMetadata["local_hostname"] = "local-hostname";
    EC2InstanceMetadata["local_ipv4"] = "local-ipv4";
    EC2InstanceMetadata["mac"] = "mac";
    EC2InstanceMetadata["public_hostname"] = "public-hostname";
    EC2InstanceMetadata["public_ipv4"] = "public-ipv4";
})(EC2InstanceMetadata = exports.EC2InstanceMetadata || (exports.EC2InstanceMetadata = {}));
var Platform;
(function (Platform) {
    Platform["Mac"] = "osx";
    Platform["Windows"] = "win";
    Platform["Linux"] = "linux";
})(Platform = exports.Platform || (exports.Platform = {}));
//# sourceMappingURL=Enums.js.map