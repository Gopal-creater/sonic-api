export interface S3FileUploadI{
  ETag: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
}

export interface S3FileUploadF{
  Location: string;
  Bucket: string;
}