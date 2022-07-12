import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  RadioStation,
  RadioStationSchemaName,
} from '../../radiostation/schemas/radiostation.schema';
import { LicenseKeySchemaName } from '../../licensekey/schemas/licensekey.schema';
import { ApiKeySchemaName } from '../../api-key/schemas/api-key.schema';

export const RadioMonitorSchemaName = 'RadioMonitor';

@Schema({ timestamps: true, collection: RadioMonitorSchemaName })
export class RadioMonitor extends Document {
  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: RadioStationSchemaName,
    required: true,
    autopopulate: { maxDepth: 2 },
  })
  radio: any;

  @ApiProperty()
  @Prop({ type: RadioStation })
  radioSearch: RadioStation;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.String,
    ref: LicenseKeySchemaName,
    required: true,
    autopopulate: { maxDepth: 2 },
    select: false,
  })
  license: any;

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
  company: any;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Partner',
    autopopulate: { maxDepth: 2 },
  })
  partner: any;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: ApiKeySchemaName,
    select: false,
  })
  apiKey: any;

  @ApiProperty()
  @Prop()
  metaData: Map<string, any>;
}

export const RadioMonitorSchema = SchemaFactory.createForClass(RadioMonitor);
