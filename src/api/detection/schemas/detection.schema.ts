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
  @Prop({ type: MogSchema.Types.ObjectId, ref: RadioStationSchemaName,autopopulate: { maxDepth: 2 } })
  radioStation: any;

  @ApiProperty()
  @Prop({ type: String, ref: SonicKeySchemaName,required:true,autopopulate: { maxDepth: 2 }})
  sonicKey: any;

  @ApiProperty()
  @Prop({select:false})
  apiKey: string;

  @ApiProperty()
  @Prop({select:false})
  licenseKey: string;

  @ApiProperty()
  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    autopopulate: { maxDepth: 2 },
  })
  owner: any;

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
    ref: 'Company',
    autopopulate: { maxDepth: 2 },
  })
  company: any;

  @ApiProperty()
  @Prop()
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
  @Prop({ type: String})
  detectionSourceFileName: string

  @ApiProperty()
  @Prop([{ type: String}])
  detectionOrigins: string[]

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