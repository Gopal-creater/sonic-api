// import {
//   attribute,
//   hashKey,
//   rangeKey,
//   table,
// } from '@aws/dynamodb-data-mapper-annotations';
// import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
// import { IsNotEmpty,IsArray } from 'class-validator';

// /**
//  * Info About Dynamodb data mapper
//  * https://github.com/awslabs/dynamodb-data-mapper-js
//  * QueryOptions==> https://github.com/awslabs/dynamodb-data-mapper-js/blob/c504011/packages/dynamodb-data-mapper/src/namedParameters/QueryOptions.ts#L19
//  * DynamoDb-Expression ==> https://awslabs.github.io/dynamodb-data-mapper-js/packages/dynamodb-expressions/#attribute-paths
//  *
//  */

// @table('SonicKey-New-Schema')
// export class SonicKey {
//   constructor(data?: Partial<SonicKey>) {
//     Object.assign(this, data);
//   }

//   @IsNotEmpty()
//   @ApiProperty()
//   @hashKey()
//   sonicKey?: string;

//   @IsNotEmpty()
//   @ApiProperty()
//   @attribute({
//     indexKeyConfigurations: {
//       ownerIndex: 'HASH',
//     },
//   })
//   owner: string;

//   @IsNotEmpty()
//   @ApiProperty()
//   @attribute({
//     indexKeyConfigurations: {
//       jobIndex: 'HASH',
//     },
//   })
//   job: string; //Relation

//   @IsNotEmpty()
//   @ApiProperty()
//   @attribute()
//   licenseId?: string;

//   @ApiProperty()
//   @rangeKey({ defaultProvider: () => new Date() })
//   createdAt: Date;

//   @ApiProperty()
//   @attribute({ defaultProvider: () => true })
//   status?: boolean;

//   //Sonic Content Part
//   @ApiProperty()
//   @attribute()
//   encodingStrength: number;

//   @ApiProperty()
//   @attribute()
//   contentType?: string;

//   @ApiProperty()
//   @attribute()
//   contentDescription: string;

//   @ApiProperty()
//   @attribute({ defaultProvider: () => new Date() })
//   contentCreatedDate: Date;

//   @ApiProperty()
//   @attribute()
//   contentDuration?: number;

//   @ApiProperty()
//   @attribute()
//   contentSize: number;

//   @ApiProperty()
//   @attribute()
//   contentFilePath: string;

//   @ApiProperty()
//   @attribute()
//   contentFileType: string;

//   @ApiProperty()
//   @attribute()
//   contentEncoding: string;

//   @ApiProperty()
//   @attribute()
//   contentSamplingFrequency: string;

//   @ApiProperty()
//   @attribute()
//   isrcCode?: string;

//   @attribute()
//   iswcCode?: string;

//   @attribute()
//   tuneCode?: string;

//   @attribute()
//   contentName?: string;

//   @ApiProperty()
//   @attribute()
//   contentOwner?: string;

//   @ApiProperty()
//   @attribute()
//   contentValidation?: boolean;

//   @ApiProperty()
//   @attribute()
//   contentFileName: string;

//   @ApiProperty()
//   @attribute()
//   contentQuality: string;

//   @ApiProperty()
//   @attribute()
//   additionalMetadata: { [key: string]: any };
// }

import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { Document,Schema as MogSchema} from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Job } from './job.schema';

export const SonicKeySchemaName="Sonickey"

@Schema({ timestamps: true,collection:SonicKeySchemaName})
export class SonicKey extends Document {
  constructor(data?: Partial<SonicKey>) {
    super()
    Object.assign(this, data);
    
  }

  @ApiProperty()
  @Prop({
    required:true,
    unique:true
  })
  sonicKey: string;

  @ApiProperty()
  @Prop()
  owner: string;

  @ApiProperty()
  @Prop({ type: MogSchema.Types.ObjectId, ref: 'Job' })
  job: Job;

  @ApiProperty()
  @Prop()
  licenseId: string;

  @ApiProperty()
  @Prop({ default: true })
  status: boolean;

  @ApiProperty()
  @Prop()
  encodingStrength: number;

  @ApiProperty()
  @Prop()
  contentType?: string;

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
  contentSize: number;

  @ApiProperty()
  @Prop()
  contentFilePath: string;

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

  @Prop()
  iswcCode?: string;

  @Prop()
  tuneCode?: string;

  @Prop()
  contentName?: string;

  @ApiProperty()
  @Prop()
  contentOwner?: string;

  @ApiProperty()
  @Prop()
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
