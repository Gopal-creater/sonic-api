import { Module, forwardRef } from '@nestjs/common';
import { PartnerService } from './services/partner.service';
import { PartnerController } from './controllers/partner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { PartnerSchemaName, PartnerSchema } from './schemas/partner.schema';
import { PartnerUserService } from './services/partner-user.service';
import { PartnerUserController } from './controllers/partner-user.controller';
import { CompanyModule } from '../company/company.module';
import { PartnerCompanyController } from './controllers/partner-company.controller';
import { PartnerCompanyService } from './services/partner-company.service';
import { GetPartnerSecurityGuard } from './guards/get-partner-security.guard';
import { UpdatePartnerSecurityGuard } from './guards/update-partner-security.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PartnerSchemaName, schema: PartnerSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [
    PartnerController,
    PartnerUserController,
    PartnerCompanyController,
  ],
  providers: [
    PartnerService,
    PartnerUserService,
    PartnerCompanyService,
    GetPartnerSecurityGuard,
    UpdatePartnerSecurityGuard,
  ],
  exports: [PartnerService, PartnerUserService, PartnerCompanyService],
})
export class PartnerModule {}
