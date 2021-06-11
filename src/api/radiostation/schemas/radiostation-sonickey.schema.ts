import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RadioStation,RadioStationSchemaName } from './radiostation.schema';
import { SonicKey,SonicKeySchemaName } from '../../sonickey/schemas/sonickey.schema';

export const RadioStationSonicKeySchemaName = 'RadioStationSonicKey';

@Schema()
export class DetectedDetail {
  @ApiProperty()
  @Prop({default:Date.now()})
  detectedAt: Date;
}

export const DetectedDetailSchema = SchemaFactory.createForClass(DetectedDetail);


@Schema({ timestamps: true, collection: RadioStationSonicKeySchemaName,toJSON:{virtuals:true} })
export class RadioStationSonicKey extends Document {

  @ApiProperty()
  @Prop({ type: MogSchema.Types.ObjectId, ref: RadioStationSchemaName, required: true,autopopulate: true })
  radioStation: any;

  @ApiProperty()
  @Prop({ type: String, ref: SonicKeySchemaName,required:true,autopopulate: true})
  sonicKey: any;

  @ApiProperty()
  @Prop()
  owner: string;

  @ApiProperty()
  @Prop()
  sonicKeyOwner: string;

  @ApiProperty()
  @Prop({default:1})
  count: number;

  @ApiProperty()
  @Prop({type: [{ type: DetectedDetailSchema}]})
  detectedDetails: [DetectedDetail];

  @ApiProperty()
  @Prop()
  metaData?: Map<string, any>;
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
