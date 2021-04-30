import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Job,JobSchemaName } from './job.schema';
import { SonicKey,SonicKeySchemaName } from '../../sonickey/schemas/sonickey.schema';

export const JobFileSchemaName="JobFile"

@Schema({ timestamps: true, collection: JobFileSchemaName,toJSON:{virtuals:true} })
export class JobFile extends Document {


  @ApiProperty()
  @Prop({required:true  })
  sonicKeyToBe: string;

  @ApiProperty({type:String})
  @Prop({ type: String})
  sonicKey: string;

  @ApiProperty()
  @Prop({ default: false })
  isComplete: boolean;

  @ApiProperty()
  @Prop()
  metaData: Map<string, any>;

  @ApiProperty({type:String})
  @Prop({ type: MogSchema.Types.ObjectId, ref: JobSchemaName,required:true})
  job: any;
}

export const JobFileSchema = SchemaFactory.createForClass(JobFile);
JobFileSchema.virtual('sonicKeyData', {
  ref: SonicKeySchemaName,
  localField: 'sonicKey',
  foreignField: 'sonicKey',
  justOne: true,
  autopopulate: true
});