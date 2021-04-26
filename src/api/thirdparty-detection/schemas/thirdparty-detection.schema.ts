import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SonicKey } from '../../../schemas/sonickey.schema';

export const ThirdpartyDetectionSchemaName = 'ThirdpartyDetection';

@Schema({ timestamps: true, collection: ThirdpartyDetectionSchemaName })
export class ThirdpartyDetection extends Document {
  
  @ApiProperty()
  @Prop()
  customer: string;

  @ApiProperty()
  sonicKey: string;

  @ApiProperty()
  @Prop({type:Date})
  detectionTime: Date;

  @ApiProperty()
  @Prop()
  metaData: Map<string, any>;
}

export const ThirdpartyDetectionSchema = SchemaFactory.createForClass(
  ThirdpartyDetection,
);