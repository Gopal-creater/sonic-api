export enum ChannelEnums {
  JOB = 'JOB',
  PCAPP = 'PCAPP',
  BINARY = 'BINARY',
  PORTAL = 'PORTAL',
  MOBILEAPP = 'MOBILEAPP',
  HARDWARE = 'HARDWARE',
  RADIOSTATION = 'RADIOSTATION',
  STREAMREADER = 'STREAMREADER',
  THIRDPARTY = 'THIRDPARTY'
}

export enum Permissions {
  MANAGE = 0x0000001,
}

export enum Roles {
  ADMIN = 'Admin',
}

export enum ApiKeyType {
  INDIVIDUAL = 'Individual',
  GROUP = 'Group',
}

export enum S3ACL{
  PRIVATE='private',
  PUBLIC_READ='public-read',
  PUBLIC_READ_WRITE='public-read-write',
  AUTHENTICATED_READ='authenticated-read',
  BUCKET_OWNER_READ='bucket-owner-read',
  BUCKET_OWNER_FULL_CONTROL='bucket-owner-full-control'
}
