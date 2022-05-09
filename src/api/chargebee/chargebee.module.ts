import { Module } from '@nestjs/common';
import { ChargebeeService } from './chargebee.service';
import { ChargebeeController } from './chargebee.controller';

@Module({
  controllers: [ChargebeeController],
  providers: [ChargebeeService]
})
export class ChargebeeModule {}
