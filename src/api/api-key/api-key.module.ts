import { Module } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeyController } from './controllers/api-key.controller';
import { ApiKeyCustomerController } from './controllers/api-key-customer.controller';
import {
  ApiKeySchemaName,
  ApiKeySchema,
} from './schemas/api-key.schema';

@Module({
  imports: [
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
