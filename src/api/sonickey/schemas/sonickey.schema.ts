import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Job, JobSchemaName } from '../../job/schemas/job.schema';
import { ApiKeySchemaName } from '../../api-key/schemas/api-key.schema';
import { ChannelEnums, FingerPrintStatus } from '../../../constants/Enums';
import { S3FileUploadI } from '../../s3fileupload/interfaces';
import { IsNotEmpty, IsOptional, IsIn, IsEmpty } from 'class-validator';
import * as distributorTypes from '../constants/distributor.constant.json';
import * as labelTypes from '../constants/label.constant.json';

export const SonicKeySchemaName = 'SonicKey';

export class EncodeResponse {
  @ApiProperty()
  result: boolean;

  @ApiProperty()
  errorno: number;

  @ApiProperty()
  sonicKey: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  message: string;
}

@Schema()
export class S3FileMeta implements S3FileUploadI {
  @ApiProperty()
  ETag: string;

  @ApiProperty()
  Location: string;

  @IsNotEmpty()
  @ApiProperty()
  key?: string;

  @IsNotEmpty()
  @ApiProperty()
  Key: string;

  @IsNotEmpty()
  @ApiProperty()
  Bucket: string;
}

@Schema({ timestamps: true, collection: SonicKeySchemaName })
export class SonicKey extends Document {
  @ApiHideProperty()
  @Prop({
    required: true,
    unique: true,
  })
  _id: string;

  @ApiProperty()
  @Prop({
    required: true,
    unique: true,
  })
  sonicKey: string;

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    autopopulate: { maxDepth: 2 },
  })
  owner: any;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Company',
    autopopulate: { maxDepth: 2 },
  })
  company: any;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Partner',
    autopopulate: { maxDepth: 2 },
  })
  partner: any;

  @ApiProperty()
  @Prop({ type: MogSchema.Types.ObjectId, ref: JobSchemaName })
  job: any;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: ApiKeySchemaName,
    select: false,
  })
  apiKey: any;

  @ApiProperty()
  @Prop({ type: String, enum: ChannelEnums, required: true })
  channel: string;

  @ApiProperty()
  @Prop({ type: String })
  channelUuid: string;

  @ApiProperty()
  @Prop({
    required: true,
    select: false,
  })
  license: string;

  @ApiProperty()
  @Prop({ default: false, required: true })
  downloadable: boolean;

  @ApiProperty()
  @Prop({ default: true })
  status: boolean;

  @IsOptional()
  @ApiProperty()
  @Prop({ default: 15 })
  encodingStrength: number;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentType: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentDescription: string;

  @IsOptional()
  @ApiProperty()
  @Prop({ default: new Date() })
  contentCreatedDate: Date;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentDuration?: number;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentSize?: number;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentFilePath: string;

  @IsOptional()
  @ApiProperty()
  @Prop({ type: S3FileMeta })
  s3FileMeta?: S3FileMeta;

  @IsOptional()
  @ApiProperty()
  @Prop({ type: S3FileMeta })
  s3OriginalFileMeta?: S3FileMeta;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentFileType: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentEncoding: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentSamplingFrequency: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  isrcCode?: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  iswcCode?: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  tuneCode?: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentName: string;

  // @IsNotEmpty()
  @ApiProperty()
  @Prop()
  contentOwner: string;

  @IsOptional()
  @ApiProperty()
  @Prop({ default: false })
  contentValidation?: boolean;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentFileName: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  originalFileName: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  contentQuality: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  additionalMetadata: Map<string, any>;

  // client requirements
  @IsOptional()
  @ApiProperty()
  @Prop({ default: false })
  isRightsHolderForEncode?: boolean;

  @IsOptional()
  @ApiProperty()
  @Prop({ default: false })
  isAuthorizedForEncode?: boolean;

  @IsOptional()
  @IsIn(distributorTypes)
  @ApiProperty()
  @Prop()
  distributor: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  version: string;

  @IsOptional()
  @IsIn(labelTypes)
  @ApiProperty()
  @Prop()
  label: string;

  @ApiProperty()
  @Prop([String])
  groups?: [string];

  @IsOptional()
  @ApiProperty()
  @Prop({ type: MogSchema.Types.Mixed })
  fingerPrintMetaData: any;

  @IsOptional()
  @ApiProperty()
  @Prop({ type: MogSchema.Types.Mixed })
  fingerPrintErrorData: any;

  @IsOptional()
  @ApiProperty()
  @Prop({ type: String, enum: FingerPrintStatus })
  fingerPrintStatus: string;

  @IsOptional()
  @ApiProperty()
  @Prop()
  queueJobId: string; //Just to track the sonickeys encoded using queueJob

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    autopopulate: { maxDepth: 2 },
  })
  createdBy: any;

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    autopopulate: { maxDepth: 2 },
  })
  updatedBy: any;

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'Track',
    autopopulate: { maxDepth: 2 },
  })
  track: any;

  @ApiProperty()
  @Prop({ type: EncodeResponse })
  encodeResponse: EncodeResponse;
}

export const SonicKeySchema = SchemaFactory.createForClass(SonicKey);
SonicKeySchema.set('toObject', { virtuals: true });
SonicKeySchema.set('toJSON', { virtuals: true });
SonicKeySchema.pre('save', function(next) {
  this._id = this.sonicKey;
  next();
});
