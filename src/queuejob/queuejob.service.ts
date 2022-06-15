import {
  Injectable
} from '@nestjs/common';
import { Model, FilterQuery, AnyObject, AnyKeys, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QueueJob } from './schemas/queuejob.schema';

@Injectable()
export class QueuejobService {
  constructor(
    @InjectModel(QueueJob.name)
    public readonly queueJobModel: Model<QueueJob>,
  ) {}

  find(filter?: FilterQuery<QueueJob>) {
    return this.queueJobModel.find(filter);
  }

  findById(id: string) {
    return this.queueJobModel.findById(id);
  }

  async create(doc: AnyObject | AnyKeys<QueueJob>) {
    const newSonicKey = await this.queueJobModel.create(doc);
    return newSonicKey.save();
  }

  update(id: string, updateSonicKeyDto: UpdateQuery<QueueJob>) {
    return this.queueJobModel.findByIdAndUpdate(id, updateSonicKeyDto, {
      new: true,
    });
  }

  findOne(filter: FilterQuery<QueueJob>) {
    return this.queueJobModel.findOne(filter).lean();
  }

  async removeById(id: string) {
    return this.queueJobModel.findByIdAndRemove(id);
  }
}
