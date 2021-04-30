import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Schema as MogSchema} from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const CornJobSchemaName="CornJob"


@Schema({ timestamps: true,collection:CornJobSchemaName})
export class CornJob extends Document {

  @ApiProperty()
  @Prop({
    required:true
  })
  name: string;

  @ApiProperty()
  @Prop()
  type: string;

}

export const CornJobSchema = SchemaFactory.createForClass(CornJob);