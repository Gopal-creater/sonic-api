import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Schema as MogSchema} from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { JobFile,JobFileSchemaName } from './jobfile.schema';
import { IsNotEmpty } from 'class-validator';

export const JobSchemaName="Job"


@Schema({ timestamps: true,collection:JobSchemaName})
export class Job extends Document {

  @IsNotEmpty()
  @ApiProperty()
  @Prop({
    required:true
  })
  name: string;

  @ApiProperty()
  @Prop({
    required:true
  })
  owner: string;

  @ApiProperty()
  @Prop({default:10})
  encodingStrength: number;

  @ApiProperty()
  @Prop({
    required:true,
    select:false
  })
  license: string;

  @ApiProperty()
  @Prop({ default: false })
  isComplete: boolean;

  @ApiProperty()
  @Prop({ type: [{ type: MogSchema.Types.ObjectId, ref: 'JobFile',autopopulate: { maxDepth: 2 } }] })
  jobFiles: any[];
}

export const JobSchema = SchemaFactory.createForClass(Job);