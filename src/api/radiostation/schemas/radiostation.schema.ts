import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { Document,Schema as MogSchema} from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const RadioStationSchemaName="RadioStation"

@Schema()
export class Credential {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

@Schema({ timestamps: true,collection:RadioStationSchemaName})
export class RadioStation extends Document {

  @ApiProperty()
  @Prop({
    required:true
  })
  name: string;

  @ApiProperty()
  @Prop({
    required:true
  })
  country: string;

  @ApiProperty()
  @Prop({
    required:true
  })
  streamingUrl: string;

  @ApiProperty()
  @Prop()
  website: string;

  @ApiProperty()
  @Prop()
  logo: string;

  @ApiProperty()
  @Prop({type:Credential})
  credential: Credential;

  @ApiProperty()
  @Prop()
  owner: string;

  @ApiProperty()
  @Prop({type:Date})
  startedAt: Date;

  @ApiProperty()
  @Prop({type:Date})
  stopAt: Date;

  @ApiProperty()
  @Prop({ default: false })
  isStreamStarted: boolean;

  @ApiProperty()
  @Prop({ default: false })
  isError: boolean;

  @ApiProperty()
  @Prop({default: null })
  error: Map<string, any>;

  @ApiProperty()
  @Prop()
  notes: string;

  @ApiProperty()
  @Prop()
  metaData: Map<string, any>;  
}

export const RadioStationSchema = SchemaFactory.createForClass(RadioStation);

