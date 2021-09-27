import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Job, JobSchemaName } from '../../job/schemas/job.schema';
import { ApiKeySchemaName } from '../../api-key/schemas/api-key.schema';
import { ChannelEnums } from '../../../constants/Enums';
import { S3FileUploadI } from '../../s3fileupload/interfaces';
import { IsNotEmpty } from 'class-validator';

export const SonicKeySchemaName = 'SonicKey';

@Schema()
export class S3FileMeta implements S3FileUploadI {

  @ApiProperty()
  ETag: string;

  @ApiProperty()
  Location: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  Key: string;

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
    required: true
  })
  owner: string;

  @ApiProperty()
  @Prop({ type: MogSchema.Types.ObjectId, ref: JobSchemaName })
  job: any;

  @ApiProperty()
  @Prop({ type: MogSchema.Types.ObjectId, ref: ApiKeySchemaName})
  apiKey: any;

  @ApiProperty()
  @Prop({ type: String, enum: ChannelEnums,required:true})
  channel: string;

  @ApiProperty()
  @Prop({ type: String})
  channelUuid: string;

  @ApiProperty()
  @Prop({
    required: true
  })
  license: string;

  @ApiProperty()
  @Prop({ default: false,required:true })
  downloadable: boolean;

  @ApiProperty()
  @Prop({ default: true })
  status: boolean;

  @ApiProperty()
  @Prop({required:true})
  encodingStrength: number;

  @ApiProperty()
  @Prop()
  contentType: string;

  @ApiProperty()
  @Prop()
  contentDescription: string;

  @ApiProperty()
  @Prop({ default: new Date() })
  contentCreatedDate: Date;

  @ApiProperty()
  @Prop()
  contentDuration?: number;

  @ApiProperty()
  @Prop()
  contentSize?: number;

  @ApiProperty()
  @Prop()
  contentFilePath: string;

  @ApiProperty()
  @Prop({type:S3FileMeta})
  s3FileMeta?: S3FileMeta;

  @ApiProperty()
  @Prop()
  contentFileType: string;

  @ApiProperty()
  @Prop()
  contentEncoding: string;

  @ApiProperty()
  @Prop()
  contentSamplingFrequency: string;

  @ApiProperty()
  @Prop()
  isrcCode?: string;

  @ApiProperty()
  @Prop()
  iswcCode?: string;

  @ApiProperty()
  @Prop()
  tuneCode?: string;

  @ApiProperty()
  @Prop()
  contentName: string;

  @IsNotEmpty()
  @ApiProperty()
  @Prop()
  contentOwner: string;

  @ApiProperty()
  @Prop({default:false})
  contentValidation?: boolean;

  @ApiProperty()
  @Prop()
  contentFileName: string;

  @ApiProperty()
  @Prop()
  contentQuality: string;

  @ApiProperty()
  @Prop()
  additionalMetadata: Map<string, any>;
}

export const SonicKeySchema = SchemaFactory.createForClass(SonicKey);

SonicKeySchema.pre('save', function(next) {
  this._id = this.sonicKey;
  next();
});

// SonicKeySchema.pre('insertMany', function (next) {
//   this.map((doc) =>
//    console.log(doc)
//   );
// });
