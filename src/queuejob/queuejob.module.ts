import { Module } from '@nestjs/common';
import { QueuejobService } from './queuejob.service';
import { QueuejobController } from './queuejob.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueJobSchemaName, QueueJobSchema } from './schemas/queuejob.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QueueJobSchemaName, schema: QueueJobSchema },
    ]),
  ],

  controllers: [QueuejobController],
  providers: [QueuejobService],
  exports:[QueuejobService]
})
export class QueuejobModule {}
