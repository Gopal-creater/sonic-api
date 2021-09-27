import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { Document,Schema as MogSchema} from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export const RadioStationSchemaName="RadioStation"

@Schema()
export class Credential {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

@Schema({ timestamps: true,collection:RadioStationSchemaName})
export class RadioStation extends Document {

  @IsNotEmpty()
  @ApiProperty()
  @Prop({
    required:true
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @Prop({
    required:true
  })
  country: string;

  @IsNotEmpty()
  @ApiProperty()
  @Prop({
    required:true,
    unique:true
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
  createdBy: string;

  @ApiProperty()
  @Prop()
  updatedBy: string;

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

