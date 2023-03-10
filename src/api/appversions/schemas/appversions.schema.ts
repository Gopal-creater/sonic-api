import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Decimal128, Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate, IsOptional } from 'class-validator';
export const AppVersionSchemaName = 'AppVersion';
import { S3FileUploadI } from '../../s3fileupload/interfaces';
import {Platform} from '../../../constants/Enums'
import { constant } from 'lodash';
import { Float } from 'aws-sdk/clients/ec2';

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



@Schema({ timestamps: true, collection: AppVersionSchemaName })
export class AppVersion extends Document {
  
  @ApiProperty()
  @Prop({
    required: true
  })
  versionCode: Float;

  @ApiProperty()
  @Prop()
  @IsOptional()
  contentVersionFilePath: string;

  @ApiProperty()
  @Prop()
  @IsOptional()
  originalVersionFileName: string;

  
  @ApiProperty()
  @Prop({
    required: true
  })
  releaseNote: string;

  @ApiProperty()
  @Prop({
    default: false
  })
  latest: boolean;

  @ApiProperty()
  @Prop({ type: String, enum: Platform})
  platform: string;

  @IsOptional()
  @ApiProperty()
  @Prop({type:S3FileMeta})
  s3FileMeta?: S3FileMeta;
}
export const AppVersionSchema = SchemaFactory.createForClass(AppVersion)
AppVersionSchema.index({versionCode:1, platform:1}, {unique:true});
 
