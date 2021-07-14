import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Schema as MogSchema} from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RadioStationSchemaName } from '../../radiostation/schemas/radiostation.schema';
import { SonicKeySchemaName } from '../../sonickey/schemas/sonickey.schema';
import { ChannelEnums } from 'src/constants/Channels.enum';


export const DetectionSchemaName="Detection"


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
  @Prop()
  metaData?: Map<string, any>;
}

export const DetectionSchema = SchemaFactory.createForClass(Detection);