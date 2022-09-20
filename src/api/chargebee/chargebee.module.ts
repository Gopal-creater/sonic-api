import { Module } from '@nestjs/common';
import { ChargebeeService } from './services/chargebee.service';
import { ChargebeeController } from './controllers/chargebee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChargeBeeSchema } from './schemas/chargebee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChargeBee', schema: ChargeBeeSchema }]),
  ],
  controllers: [ChargebeeController],
  providers: [ChargebeeService],
})
export class ChargebeeModule {}
