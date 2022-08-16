import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsValidCountry } from '../validation/isValidCountry.validation';

export const RadioStationSchemaName = 'RadioStation';

@Schema()
export class Credential {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

@Schema()
export class MonitorGroup {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}

@Schema({ timestamps: true, collection: RadioStationSchemaName })
export class RadioStation extends Document {
  @IsNotEmpty()
  @ApiProperty()
  @Prop({
    required: true,
  })
  appGenStationId:string;

  @IsNotEmpty()
  @ApiProperty()
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @Prop({
    // required: true,
    // unique: true,
  })
  streamingUrl: string;

  @ApiProperty()
  @Prop()
  subTitle: string;

  @ApiProperty()
  @Prop()
  logo: string;

  @IsNotEmpty()
  @ApiProperty()
  @Prop({
    required: true,
  })
  continent:string

  @IsNotEmpty()
  @IsValidCountry()
  @ApiProperty()
  @Prop({
    required: true,
  })
  country: string;

  @IsNotEmpty()
  @ApiProperty()
  @Prop({
    required: true,
  })
  state:string

  @IsNotEmpty()
  @ApiProperty()
  @Prop({
    required: true,
  })
  city:string

  @ApiProperty()
  @Prop([{type:String}])
  genres: string[];

  @IsNotEmpty()
  @ApiProperty()
  @Prop({ required: true })
  adminEmail: string;


  //Other items which are not in provided excel--------------------------------
  @ApiProperty()
  @Prop()
  website: string;

  @ApiProperty()
  @Prop([MonitorGroup])
  monitorGroups?: MonitorGroup[]

  @ApiProperty()
  @Prop({ type: Credential })
  credential: Credential;

  @ApiProperty()
  @Prop()
  createdBy: string;

  @ApiProperty()
  @Prop()
  updatedBy: string;

  @ApiProperty()
  @Prop({ type: Date })
  startedAt: Date;

  @ApiProperty()
  @Prop({ type: Date })
  stopAt: Date;

  @ApiProperty()
  @Prop({ default: false })
  isStreamStarted: boolean;

  @ApiProperty()
  @Prop({ default: false })
  isError: boolean;

  //New Field
  @ApiProperty()
  @Prop({ default: false })
  running: boolean;

  //New Field
  @ApiProperty()
  @Prop({ default: false })
  shortListed: boolean;

   //New Field
  @ApiProperty()
  @Prop({ default: false })
  isFromAppGen: boolean;

  @ApiProperty()
  @Prop({ default: null })
  error: Map<string, any>;

  @ApiProperty()
  @Prop()
  notes: string;

  @ApiProperty()
  @Prop()
  metaData: Map<string, any>;
}

export const RadioStationSchema = SchemaFactory.createForClass(RadioStation);
