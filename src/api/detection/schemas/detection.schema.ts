import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Schema as MogSchema} from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RadioStationSchemaName } from '../../radiostation/schemas/radiostation.schema';
import { SonicKeySchemaName } from '../../sonickey/schemas/sonickey.schema';
import { ChannelEnums } from 'src/constants/Enums';


export const DetectionSchemaName="Detection"

@Schema()
export class DetectedTimeStamp{
  @ApiProperty()
  @Prop()
  start: number;

  @ApiProperty()
  @Prop()
  end: number;
}

@Schema()
export class ThirdpartyStreamReaderDetection{
  @ApiProperty()
  country: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  detectedAt: Date;

  @ApiProperty()
  metaData?: Map<string, any>;
}

@Schema({ timestamps: true,collection:DetectionSchemaName})
export class Detection extends Document {

  @ApiProperty()
  @Prop({ type: MogSchema.Types.ObjectId, ref: RadioStationSchemaName,autopopulate: true })
  radioStation: any;

  @ApiProperty()
  @Prop({ type: String, ref: SonicKeySchemaName,required:true,autopopulate: true})
  sonicKey: any;

  @ApiProperty()
  @Prop()
  apiKey: string;

  @ApiProperty()
  @Prop()
  licenseKey: string;

  @ApiProperty()
  @Prop({required:true})
  owner: string;

  @ApiProperty()
  @Prop({required:true})
  sonicKeyOwnerId: string;

  @ApiProperty()
  @Prop()
  sonicKeyOwnerName: string;

  @ApiProperty()
  @Prop({ type: String, enum: ChannelEnums,required:true})
  channel: string;

  @ApiProperty()
  @Prop({ type: String})
  channelUuid: string;

  @ApiProperty()
  @Prop({default:Date.now()})
  detectedAt: Date;

  @ApiProperty()
  @Prop([DetectedTimeStamp])
  detectedTimestamps: DetectedTimeStamp[];

  @ApiProperty()
  @Prop()
  detectedDuration: number;

  @ApiProperty()
  @Prop()
  metaData?: Map<string, any>;

  @ApiProperty()
  @Prop({ type: ThirdpartyStreamReaderDetection })
  thirdpartyStreamReaderDetection: ThirdpartyStreamReaderDetection;

  @ApiProperty()
  @Prop([String])
  groups?: [string];
}

export const DetectionSchema = SchemaFactory.createForClass(Detection);