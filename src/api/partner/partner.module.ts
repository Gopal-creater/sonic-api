import { Module, forwardRef } from '@nestjs/common';
import { PartnerService } from './services/partner.service';
import { PartnerController } from './controllers/partner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { PartnerSchemaName, PartnerSchema } from './schemas/partner.schema';
import { PartnerUserService } from './services/partner-user.service';
import { PartnerUserController } from './controllers/partner-user.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
  MongooseModule.forFeature([
      { name: PartnerSchemaName, schema: PartnerSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [PartnerController, PartnerUserController],
  providers: [PartnerService, PartnerUserService],
  exports: [PartnerService, PartnerUserService],
})
export class PartnerModule {}
