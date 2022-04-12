import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QueueJob } from './schemas/queuejob.schema';

@Injectable()
export class QueuejobService {
  constructor(
    @InjectModel(QueueJob.name)
    public readonly queueJobModel: Model<QueueJob>,
  ) {}


}
