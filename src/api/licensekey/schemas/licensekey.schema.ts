import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { ApiKeyType } from 'src/constants/Enums';

export const LicenseKeySchemaName = 'LicenseKey';

@Schema()
export class LKOwner {
  @ApiProperty()
  @Prop({ type: String, ref: 'User', required: true, autopopulate: true })
  ownerId: any;

  @ApiProperty()
  @Prop({ required: true })
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
export class LKReserve {
  @ApiProperty()
  @Prop({ required: true })
  jobId: string;

  @ApiProperty()
  @Prop({ required: true })
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
  @Prop({ required: true, default: 0 })
  maxEncodeUses: number;

  @ApiProperty()
  @Prop({ required: true, default: 0 })
  oldMaxEncodeUses: number;

  @ApiProperty()
  @Prop({ default: 0 })
  encodeUses: number;

  @ApiProperty()
  @Prop({ required: false, default: false })
  isUnlimitedEncode: boolean;

  @ApiProperty()
  @Prop({ required: true, default: 0 })
  maxDecodeUses: number;

  @ApiProperty()
  @Prop({ required: true, default: 0 })
  oldMaxDecodeUses: number;

  @ApiProperty()
  @Prop({ default: 0 })
  decodeUses: number;

  @ApiProperty()
  @Prop({ required: false, default: false })
  isUnlimitedDecode: boolean;

  @ApiProperty()
  @Prop({ required: true, default: 0 })
  maxMonitoringUses: number;

  @ApiProperty()
  @Prop({ required: true, default: 0 })
  oldMaxMonitoringUses: number;

  @ApiProperty()
  @Prop({ default: 0 })
  monitoringUses: number;

  @ApiProperty()
  @Prop({ required: false, default: false })
  isUnlimitedMonitor: boolean;

  @ApiProperty()
  @Prop({
    type: Date,
    default: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  })
  validity?: Date;

  @ApiProperty()
  @Prop({
    type: Date
  })
  oldValidity?: Date;

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
  owners?: LKOwner[];

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Company',
    autopopulate: { maxDepth: 2 },
  })
  company: any;

  @ApiProperty()
  @Prop([
    { type: String, ref: 'User', autopopulate: { maxDepth: 2 }, default: [] },
  ])
  users: any[];

  @ApiProperty()
  @Prop({ type: String, enum: ApiKeyType, default: 'Individual' })
  type: string;

  @ApiProperty()
  @Prop([LKReserve])
  reserves?: LKReserve[];

  //Just to identify that this license key was created from plan selection in WPMS
  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Plan',
    autopopulate: { maxDepth: 2 },
  })
  previousPlan: any;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Plan',
    autopopulate: { maxDepth: 2 },
  })
  activePlan: any;

  @ApiProperty()
  @Prop([
    {
      type: MogSchema.Types.ObjectId,
      ref: 'Plan',
      autopopulate: { maxDepth: 2 },
      default: [],
    },
  ])
  payments: any[];

  @ApiProperty()
  @Prop()
  planType: string;

  @ApiProperty()
  @Prop()
  notes?: string;

  @ApiProperty()
  @Prop([String])
  logs?: string[];
}

export const LicenseKeySchema = SchemaFactory.createForClass(LicenseKey);
