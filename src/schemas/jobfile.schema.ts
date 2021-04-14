import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Job,JobSchemaName } from './job.schema';
import { SonicKey } from './sonickey.schema';

export const JobFileSchemaName="JobFile"

@Schema({ timestamps: true, collection: JobFileSchemaName })
export class JobFile extends Document {
  constructor(data?: Partial<JobFile>) {
    super();
    Object.assign(this, data);
  }

  @ApiProperty()
  @Prop({required:true  })
  sonicKeyToBe: string;

  @ApiProperty()
  @Prop({ type: MogSchema.Types.ObjectId, ref: 'Sonickey'})
  sonicKey: SonicKey;

  @ApiProperty()
  @Prop({ default: false })
  isComplete: boolean;

  @ApiProperty()
  @Prop()
  metaData: Map<string, any>;

  @ApiProperty({type:String})
  @Prop({ type: MogSchema.Types.ObjectId, ref: 'Job',required:true})
  job: Job;
}

export const JobFileSchema = SchemaFactory.createForClass(JobFile);
