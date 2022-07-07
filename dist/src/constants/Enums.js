"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = exports.EC2InstanceMetadata = exports.SystemRoles = exports.SystemGroup = exports.AppRoles = exports.Roles = exports.MonitorGroupsEnum = exports.S3ACL = exports.PaymentInterval = exports.PlanType = exports.PlanName = exports.FingerPrintEvents = exports.FingerPrintStatus = exports.UserType = exports.ApiKeyType = exports.Permissions = exports.DETECTION_ORIGINS = exports.ChannelEnums = void 0;
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
    ChannelEnums["THIRDPARTY_BULK"] = "THIRDPARTY_BULK";
    ChannelEnums["FINGERPRINT"] = "FINGERPRINT";
})(ChannelEnums = exports.ChannelEnums || (exports.ChannelEnums = {}));
var DETECTION_ORIGINS;
(function (DETECTION_ORIGINS) {
    DETECTION_ORIGINS["SONICKEY"] = "SONICKEY";
    DETECTION_ORIGINS["FINGERPRINT"] = "FINGERPRINT";
})(DETECTION_ORIGINS = exports.DETECTION_ORIGINS || (exports.DETECTION_ORIGINS = {}));
var Permissions;
(function (Permissions) {
    Permissions[Permissions["MANAGE"] = 1] = "MANAGE";
})(Permissions = exports.Permissions || (exports.Permissions = {}));
var ApiKeyType;
(function (ApiKeyType) {
    ApiKeyType["INDIVIDUAL"] = "Individual";
    ApiKeyType["COMPANY"] = "Company";
})(ApiKeyType = exports.ApiKeyType || (exports.ApiKeyType = {}));
var UserType;
(function (UserType) {
    UserType["INDIVIDUAL"] = "Individual";
    UserType["COMPANY"] = "Company";
    UserType["PARTNER"] = "Partner";
})(UserType = exports.UserType || (exports.UserType = {}));
var FingerPrintStatus;
(function (FingerPrintStatus) {
    FingerPrintStatus["SUCCESS"] = "Success";
    FingerPrintStatus["FAILED"] = "Failed";
    FingerPrintStatus["PENDING"] = "Pending";
    FingerPrintStatus["PROCESSING"] = "Processing";
})(FingerPrintStatus = exports.FingerPrintStatus || (exports.FingerPrintStatus = {}));
var FingerPrintEvents;
(function (FingerPrintEvents) {
    FingerPrintEvents["COMPLETED"] = "Completed";
    FingerPrintEvents["FAILED"] = "Failed";
})(FingerPrintEvents = exports.FingerPrintEvents || (exports.FingerPrintEvents = {}));
var PlanName;
(function (PlanName) {
    PlanName["BASIC"] = "Basic";
    PlanName["STANDARD"] = "Standard";
    PlanName["PREMIUM"] = "Premium";
})(PlanName = exports.PlanName || (exports.PlanName = {}));
var PlanType;
(function (PlanType) {
    PlanType["ENCODE"] = "Encode";
    PlanType["DECODE"] = "Decode";
    PlanType["MONITORING"] = "Monitoring";
})(PlanType = exports.PlanType || (exports.PlanType = {}));
var PaymentInterval;
(function (PaymentInterval) {
    PaymentInterval["ANNUAL"] = "Annual";
})(PaymentInterval = exports.PaymentInterval || (exports.PaymentInterval = {}));
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
    Roles["PARTNER_ADMIN"] = "PartnerAdmin";
    Roles["PARTNER_USER"] = "PartnerUser";
    Roles["COMPANY_USER"] = "CompanyUser";
})(Roles = exports.Roles || (exports.Roles = {}));
var AppRoles;
(function (AppRoles) {
    AppRoles["ADMIN"] = "Admin";
    AppRoles["PARTNER_ADMIN"] = "PartnerAdmin";
    AppRoles["PARTNER_USER"] = "PartnerUser";
    AppRoles["PARTNER_COMPANY"] = "PartnerUser";
    AppRoles["COMPANY_ADMIN"] = "CompanyAdmin";
    AppRoles["THIRDPARTY_ADMIN"] = "ThirdPartyAdmin";
})(AppRoles = exports.AppRoles || (exports.AppRoles = {}));
var SystemGroup;
(function (SystemGroup) {
    SystemGroup["ADMIN"] = "Admin";
    SystemGroup["PORTAL_USER"] = "PortalUser";
    SystemGroup["WPMS_USER"] = "WPMSUser";
    SystemGroup["PARTNER_ADMIN"] = "PartnerAdmin";
    SystemGroup["PARTNER_COMPANY"] = "PartnerCompany";
    SystemGroup["PARTNER_USER"] = "PartnerUser";
    SystemGroup["COMPANY_ADMIN"] = "CompanyAdmin";
    SystemGroup["COMPANY_USER"] = "CompanyUser";
})(SystemGroup = exports.SystemGroup || (exports.SystemGroup = {}));
var SystemRoles;
(function (SystemRoles) {
    SystemRoles["ADMIN"] = "Admin";
    SystemRoles["PORTAL_USER"] = "PortalUser";
    SystemRoles["WPMS_USER"] = "WPMSUser";
    SystemRoles["PARTNER_ADMIN"] = "PartnerAdmin";
    SystemRoles["PARTNER_USER"] = "PartnerUser";
    SystemRoles["COMPANY_ADMIN"] = "CompanyAdmin";
    SystemRoles["COMPANY_USER"] = "CompanyUser";
})(SystemRoles = exports.SystemRoles || (exports.SystemRoles = {}));
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