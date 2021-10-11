import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';


export const LicenseKeySchemaName = 'LicenseKey';

@Schema()
export class LKOwner{
  @ApiProperty()
  @Prop({required:true})
  ownerId: string;

  @ApiProperty()
  @Prop({required:true})
  username: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  name: string;
}

/**
 * userType==> [WPMS=1]
 * Payment (Id, OwnerId, cost, method,plan)
 * ServiceSubscription (Id, ownerId, payment)
 */
@Schema()
export class LKReserve{
  @ApiProperty()
  @Prop({required:true})
  jobId: string;

  @ApiProperty()
  @Prop({required:true})
  count: number;
}

@Schema({ timestamps: true, collection: LicenseKeySchemaName })
export class LicenseKey extends Document {
  //_id or id will be apikey here, which is always unique

  @ApiHideProperty()
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  _id: string;

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  key: string;

  @ApiProperty()
  @Prop({ type: Boolean, default: false })
  disabled?: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, default: false })
  suspended?: boolean;

  @ApiProperty()
  @Prop({ required: true,default: 0 })
  maxEncodeUses: number;

  @ApiProperty()
  @Prop({ default: 0 })
  encodeUses: number;

  @ApiProperty()
  @Prop({ required: false,default: false })
  isUnlimitedEncode: boolean;

  @ApiProperty()
  @Prop({ required: true,default: 0 })
  maxDecodeUses: number;

  @ApiProperty()
  @Prop({ default: 0 })
  decodeUses: number;

  @ApiProperty()
  @Prop({ required: false,default: false, })
  isUnlimitedDecode: boolean;

  @ApiProperty()
  @Prop({ required: true,default: 0 })
  maxMonitoringUses: number;

  @ApiProperty()
  @Prop({ default: 0 })
  monitoringUses: number;

  @ApiProperty()
  @Prop({ required: false,default: false })
  isUnlimitedMonitor: boolean;

  @ApiProperty()
  @Prop({
    type: Date,
    default: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  })
  validity?: Date;

  @ApiProperty()
  @Prop()
  metaData?: Map<string, any>;

  @ApiProperty()
  @Prop({ required: true })
  createdBy?: string;

  @ApiProperty()
  @Prop()
  updatedBy?: string;

  @ApiProperty()
  @Prop([LKOwner])
  owners?:LKOwner[]

  @ApiProperty()
  @Prop([LKReserve])
  reserves?:LKReserve[]
}

export const LicenseKeySchema = SchemaFactory.createForClass(LicenseKey);
