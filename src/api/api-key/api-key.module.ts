import { Module,forwardRef } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeyController } from './controllers/api-key.controller';
import { ApiKeyCustomerController } from './controllers/api-key-customer.controller';
import {
  ApiKeySchemaName,
  ApiKeySchema,
} from './schemas/api-key.schema';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
  forwardRef(() => UserModule),
    MongooseModule.forFeature([
      {
        name: ApiKeySchemaName,
        schema: ApiKeySchema,
      },
    ]),
  ],
  controllers: [ApiKeyController,ApiKeyCustomerController],
  providers: [ApiKeyService],
  exports:[ApiKeyService]
})
export class ApiKeyModule {}
