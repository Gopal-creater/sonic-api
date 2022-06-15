import { Module, forwardRef } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchemaName, CompanySchema } from './schemas/company.schema';
import { UserModule } from '../user/user.module';
import { CreateCompanySecurityGuard } from './guards/create-company.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CompanySchemaName, schema: CompanySchema }]),
    forwardRef(()=>UserModule)
  ],
  controllers: [CompanyController],
  providers: [CompanyService,CreateCompanySecurityGuard],
  exports: [CompanyService],
})
export class CompanyModule {}
