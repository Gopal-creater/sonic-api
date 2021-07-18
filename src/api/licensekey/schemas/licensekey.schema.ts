import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export const LicenseKeySchemaName = 'LicenseKey';

@Schema()
export class LKOwner{
  @ApiProperty()
  ownerId: string;
}

@Schema({ timestamps: true, collection: LicenseKeySchemaName })
export class LicenseKey extends Document {
  //_id or id will be apikey here, which is always unique

  @ApiHideProperty()
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  _id: string;

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  key: string;

  @ApiProperty()
  @Prop({ type: Boolean, default: false })
  disabled?: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, default: false })
  suspended?: boolean;

  @ApiProperty()
  @Prop({ required: true })
  maxEncodeUses: number;

  @ApiProperty()
  @Prop({ default: 0 })
  encodeUses: number;

  @ApiProperty()
  @Prop({ required: true })
  maxDecodeUses: number;

  @ApiProperty()
  @Prop({ default: 0 })
  decodeUses: number;

  @ApiProperty()
  @Prop({
    type: Date,
    default: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  })
  validity?: Date;

  @ApiProperty()
  @Prop()
  metaData?: Map<string, any>;

  @ApiProperty()
  @Prop([LKOwner])
  owners?:LKOwner[]
}

export const LicenseKeySchema = SchemaFactory.createForClass(LicenseKey);
