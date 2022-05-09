export enum ChannelEnums {
  JOB = 'JOB',
  PCAPP = 'PCAPP',
  BINARY = 'BINARY',
  PORTAL = 'PORTAL',
  MOBILEAPP = 'MOBILEAPP',
  HARDWARE = 'HARDWARE',
  RADIOSTATION = 'RADIOSTATION',
  STREAMREADER = 'STREAMREADER',
  THIRDPARTY_STREAMREADER = 'THIRDPARTY_STREAMREADER',
  THIRDPARTY = 'THIRDPARTY',
  THIRDPARTY_BULK = 'THIRDPARTY_BULK',
}

export enum Permissions {
  MANAGE = 0x0000001,
}


export enum ApiKeyType {
  INDIVIDUAL = 'Individual',
  COMPANY = 'Company',
}

export enum UserType {
  INDIVIDUAL = 'Individual',
  COMPANY = 'Company',
  PARTNER = 'Partner',
}

export enum FingerPrintStatus {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  PENDING = 'Pending',
  PROCESSING = 'Processing',
}

export enum FingerPrintEvents {
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

export enum PlanName {
  BASIC = 'Basic',
  STANDARD = 'Standard',
  PREMIUM='Premium'
}

export enum PlanType {
  ENCODE = 'Encode',
  DECODE = 'Decode',
  MONITORING='Monitoring'
}

export enum PaymentInterval {
  ANNUAL = 'Annual'
}

export enum S3ACL {
  PRIVATE = 'private',
  PUBLIC_READ = 'public-read',
  PUBLIC_READ_WRITE = 'public-read-write',
  AUTHENTICATED_READ = 'authenticated-read',
  BUCKET_OWNER_READ = 'bucket-owner-read',
  BUCKET_OWNER_FULL_CONTROL = 'bucket-owner-full-control',
}

export enum MonitorGroupsEnum {
  AIM = 'AIM',
  AFEM = 'AFEM'
}

export enum Roles {
  ADMIN = 'Admin',
  AIM='AIM',
  AFEM='AFEM',
  PORTAL_USER='PortalUser',
  WPMS_USER='WPMSUser',
  COMPANY_ADMIN='CompanyAdmin',
  THIRDPARTY_ADMIN='ThirdPartyAdmin'
}

export enum AppRoles {
  ADMIN = 'Admin',
  PARTNER_ADMIN='PartnerAdmin',
  PARTNER_USER='PartnerUser',
  PARTNER_COMPANY='PartnerUser',
  COMPANY_ADMIN='CompanyAdmin',
  THIRDPARTY_ADMIN='ThirdPartyAdmin'
}

export enum SystemGroup {
  ADMIN = 'Admin',
  PORTAL_USER='PortalUser',
  WPMS_USER='WPMSUser',
  PARTNER_ADMIN='PartnerAdmin',
  PARTNER_COMPANY='PartnerCompany',
  PARTNER_USER='PartnerUser',
  COMPANY_ADMIN='CompanyAdmin',
  COMPANY_USER='CompanyUser'
}

export enum AccountTypes {
  ADMIN = 'Admin',
  PORTAL_USER='PortalUser',
  WPMS_USER='WPMSUser',
  PARTNER_ADMIN='Partner Admin',
  PARTNER='Partner',
  COMPANY_ADMIN='CompanyAdmin',
  COMPANY='Company'
}

export enum EC2InstanceMetadata {
  'ami_id' = 'ami-id',
  'hostname' = 'hostname',
  'instance_id' = 'instance-id',
  'instance_type' = 'instance-type',
  'local_hostname' = 'local-hostname',
  'local_ipv4' = 'local-ipv4',
  'mac' = 'mac',
  'public_hostname' = 'public-hostname',
  'public_ipv4' = 'public-ipv4',
}

export enum Platform {
  'Mac' = 'osx',
  'Windows' = 'win',
  'Linux' = 'linux'
}
