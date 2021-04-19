import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RadioStation,RadioStationSchemaName } from './radiostation.schema';
import { SonicKey,SonicKeySchemaName } from './sonickey.schema';

export const RadioStationSonicKeySchemaName = 'RadioStationSonicKey';

@Schema({ timestamps: true, collection: RadioStationSonicKeySchemaName,toJSON:{virtuals:true} })
export class RadioStationSonicKey extends Document {

  @ApiProperty()
  @Prop({ type: MogSchema.Types.ObjectId, ref: RadioStationSchemaName, required: true,autopopulate: true })
  radioStation: any;

  @ApiProperty()
  @Prop({ type:String})
  sonicKey: any;

  @ApiProperty()
  @Prop({default:0})
  count: number;

  @ApiProperty()
  @Prop()
  owner: string;

  @ApiProperty()
  @Prop()
  metaData: Map<string, any>;
}

export const RadioStationSonicKeySchema = SchemaFactory.createForClass(
  RadioStationSonicKey,
);

RadioStationSonicKeySchema.virtual('sonicKeyData', {
  ref: SonicKeySchemaName,
  localField: 'sonicKey',
  foreignField: 'sonicKey',
  justOne: true,
  autopopulate: true
});
