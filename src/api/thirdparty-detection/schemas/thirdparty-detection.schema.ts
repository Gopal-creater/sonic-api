import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SonicKey,SonicKeySchemaName } from '../../sonickey/schemas/sonickey.schema';

export const ThirdpartyDetectionSchemaName = 'ThirdpartyDetection';

@Schema({ timestamps: true })
export class ThirdpartyDetection extends Document {
  
  @ApiProperty()
  @Prop({required:true})
  customer: string;

  @ApiProperty()
  @Prop()
  apiKey: string;

  @ApiProperty()
  @Prop({ type: String, ref: SonicKeySchemaName,required:true,autopopulate: { maxDepth: 2 }})
  sonicKey: any;

  @ApiProperty()
  @Prop({type:Date})
  detectionTime: Date;

  @ApiProperty()
  @Prop()
  metaData: Map<string, any>;
}

export const ThirdpartyDetectionSchema = SchemaFactory.createForClass(ThirdpartyDetection);