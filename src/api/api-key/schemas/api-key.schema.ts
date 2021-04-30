import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const ApiKeySchemaName = 'ApiKey';

@Schema({ timestamps: true, collection: ApiKeySchemaName })
export class ApiKey extends Document {
  
  @ApiProperty()
  @Prop({required:true})
  owner: string;

  @ApiProperty()
  @Prop({type:Boolean,default:false})
  disabled?: boolean;

  @ApiProperty()
  @Prop()
  metaData?: Map<string, any>;
}

export const ApiKeySchema = SchemaFactory.createForClass(
  ApiKey,
);