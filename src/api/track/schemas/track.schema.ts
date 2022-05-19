import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { ApiKeySchemaName } from '../../api-key/schemas/api-key.schema';
import { ChannelEnums } from '../../../constants/Enums';
import { S3FileMeta } from 'src/api/sonickey/schemas/sonickey.schema';

export const TrackSchemaName = 'Track';

@Schema({ timestamps: true, collection: TrackSchemaName })
export class Track extends Document {
  @ApiHideProperty()
  @Prop({
    required: true,
    unique: true,
  })
  _id: string;

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    autopopulate: { maxDepth: 2 },
  })
  owner: string;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Company',
    autopopulate: { maxDepth: 2 },
  })
  company: string;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Partner',
    autopopulate: { maxDepth: 2 },
  })
  partner: string;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: ApiKeySchemaName,
    select: false,
  })
  apiKey: any;

  @ApiProperty()
  @Prop({ type: String, enum: ChannelEnums, required: true,default:ChannelEnums.PORTAL })
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
  @Prop()
  mimeType: string; //mimetype

  @ApiProperty()
  @Prop()
  artist: string; //saved from encode dto, can not be changed later

  @ApiProperty()
  @Prop()
  title: string; //saved from encode dto, can not be changed later

  @ApiProperty()
  @Prop()
  duration?: number;

  @ApiProperty()
  @Prop()
  fileSize?: number;

  @ApiProperty()
  @Prop()
  localFilePath: string; //Path where it is saved

  @ApiProperty()
  @Prop({ type: S3FileMeta })
  s3OriginalFileMeta?: S3FileMeta; 

  @ApiProperty()
  @Prop()
  fileType: string; //Music|Audio|Video

  @ApiProperty()
  @Prop()
  encoding: string;

  @ApiProperty()
  @Prop()
  samplingFrequency: string;

  @ApiProperty()
  @Prop()
  originalFileName: string;

  @ApiProperty()
  @Prop({type:MogSchema.Types.Mixed})
  iExtractedMetaData: any;

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    autopopulate: { maxDepth: 2 },
  })
  createdBy: string;

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    autopopulate: { maxDepth: 2 },
  })
  updatedBy: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
