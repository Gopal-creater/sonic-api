import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RadioStation, RadioStationSchemaName } from '../../radiostation/schemas/radiostation.schema';
import { LicenseKeySchemaName } from '../../licensekey/schemas/licensekey.schema';

export const RadioMonitorSchemaName = 'RadioMonitor';

@Schema({ timestamps: true, collection: RadioMonitorSchemaName })
export class RadioMonitor extends Document {
  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: RadioStationSchemaName,
    required: true,
    autopopulate: true,
  })
  radio: any;

  @ApiProperty()
  @Prop({type:RadioStation})
  radioSearch: RadioStation;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.String,
    ref: LicenseKeySchemaName,
    required: true,
    autopopulate: false,
  })
  license: any;

  @ApiProperty()
  @Prop({
    required: true,
  })
  owner: string;

  @ApiProperty()
  @Prop({ type: Date })
  startedAt: Date;

  @ApiProperty()
  @Prop({ type: Date })
  stopAt: Date;

  @ApiProperty()
  @Prop({ default: false })
  isListeningStarted: boolean;

  @ApiProperty()
  @Prop({ default: false })
  isError: boolean;

  @ApiProperty()
  @Prop({ default: null })
  error: Map<string, any>;

  @ApiProperty()
  @Prop()
  metaData: Map<string, any>;
}

export const RadioMonitorSchema = SchemaFactory.createForClass(RadioMonitor);
