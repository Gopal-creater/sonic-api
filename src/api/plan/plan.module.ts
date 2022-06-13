import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './controllers/plan.controller';
import { PlansOwnerController } from './controllers/plan-owner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanSchemaName, PlanSchema } from './schemas/plan.schema';
import { LicensekeyModule } from '../licensekey/licensekey.module';
import { PaymentModule } from '../payment/payment.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
MongooseModule.forFeature([{ name: PlanSchemaName, schema: PlanSchema }]),
    forwardRef(() => LicensekeyModule),
    forwardRef(() => PaymentModule),
  ],
  controllers: [PlanController,PlansOwnerController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule implements OnModuleInit {
  constructor(private readonly planService: PlanService,private readonly configService:ConfigService) {}
  onModuleInit() {
    this.planService.createDefaultPlans();
    console.log("path",this.configService.get('ENCODER_EXE_PATH'))
    console.log("path",this.configService.get('DECODER_EXE_PATH'))
  }
}
