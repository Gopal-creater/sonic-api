export enum ChannelEnums {
  JOB = 'JOB',
  PCAPP = 'PCAPP',
  BINARY = 'BINARY',
  PORTAL = 'PORTAL',
  MOBILEAPP = 'MOBILEAPP',
  HARDWARE = 'HARDWARE',
  RADIOSTATION = 'RADIOSTATION',
  STREAMREADER = 'STREAMREADER',
  THIRDPARTY = 'THIRDPARTY',
}

export enum Permissions {
  MANAGE = 0x0000001,
}


export enum ApiKeyType {
  INDIVIDUAL = 'Individual',
  GROUP = 'Group',
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
  THIRDPARTY_ADMIN='ThirdPartyAdmin'
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
