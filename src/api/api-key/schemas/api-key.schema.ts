import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ApiKeyType } from 'src/constants/Enums';

export const ApiKeySchemaName = 'ApiKey';


@Schema({ timestamps: true, collection: ApiKeySchemaName })
export class ApiKey extends Document { //_id or id will be apikey here, which is always unique

  @ApiProperty()
  @Prop({ type: String, ref: 'User',required:true,autopopulate: true})
  customer: any;

  @ApiProperty()
  @Prop([String])
  groups: [string];

  @ApiProperty()
  @Prop({ type: MogSchema.Types.ObjectId, ref: 'Company',autopopulate: true})
  company: any;

  @ApiProperty()
  @Prop({type:Date,default:new Date(new Date().setFullYear(new Date().getFullYear() + 1))})
  validity?: Date;

  @ApiProperty()
  @Prop({type:Boolean,default:false})
  disabled?: boolean;

  @ApiProperty()
  @Prop({type:String,enum:ApiKeyType,default:"Individual"})
  type?: string;

  @ApiProperty()
  @Prop({type:Boolean,default:false})
  suspended?: boolean;

  @ApiProperty()
  @Prop({type:Boolean,default:false})
  revoked?: boolean;

  @ApiProperty()
  @Prop()
  createdBy?: string;

  @ApiProperty()
  @Prop()
  metaData?: Map<string, any>;
}

export const ApiKeySchema = SchemaFactory.createForClass(
  ApiKey,
);