import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const QueueJobSchemaName = 'QueueJob';

@Schema({ timestamps: true, collection: QueueJobSchemaName })
export class QueueJob extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  _id: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ type: MogSchema.Types.Mixed })
  jobData?: any;

  @ApiProperty()
  @Prop({ type: MogSchema.Types.Mixed })
  metaData?: any;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Company',
    autopopulate: { maxDepth: 2 },
  })
  company: any;

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    autopopulate: { maxDepth: 2 },
  })
  user: any;

  @ApiProperty()
  @Prop({default:false})
  completed?: boolean;

  @ApiProperty()
  @Prop({default:false})
  error?: boolean;

  @ApiProperty()
  @Prop({type: MogSchema.Types.Mixed})
  errorData?: any;
}

export const QueueJobSchema = SchemaFactory.createForClass(QueueJob);
