import { Controller } from '@nestjs/common';
import { QueuejobService } from './queuejob.service';

@Controller('queuejob')
export class QueuejobController {
  constructor(private readonly queuejobService: QueuejobService) {}
}
