import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const ThirdpartyDetectionSchemaName = 'ThirdpartyDetection';

@Schema({ timestamps: true })
export class ThirdpartyDetection extends Document {
  
  @ApiProperty()
  @Prop({required:true})
  customer: string;

  @ApiProperty()
  @Prop({required:true})
  sonicKey: string;

  @ApiProperty()
  @Prop({type:Date})
  detectionTime: Date;

  @ApiProperty()
  @Prop()
  metaData: Map<string, any>;
}

export const ThirdpartyDetectionSchema = SchemaFactory.createForClass(ThirdpartyDetection);