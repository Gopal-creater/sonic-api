import { Injectable } from '@nestjs/common';
import { CreateThirdpartyDetectionDto } from './dto/create-thirdparty-detection.dto';
import { UpdateThirdpartyDetectionDto } from './dto/update-thirdparty-detection.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ThirdpartyDetection } from './schemas/thirdparty-detection.schema';
import { Model } from 'mongoose';
import { QueryDto } from '../../shared/dtos/query.dto';

@Injectable()
export class ThirdpartyDetectionService {
  constructor(
    @InjectModel(ThirdpartyDetection.name)
    public readonly thirdpartyDetectionModel: Model<ThirdpartyDetection>,
  ) {}
  create(createThirdpartyDetectionDto: CreateThirdpartyDetectionDto) {
    if (!createThirdpartyDetectionDto.detectionTime) {
      createThirdpartyDetectionDto.detectionTime = new Date();
    }
    const newDetection = new this.thirdpartyDetectionModel(
      createThirdpartyDetectionDto,
    );
    return newDetection.save();
  }

  async findAll(queryDto: QueryDto = {}) {
    const { limit, offset, ...query } = queryDto;
    return this.thirdpartyDetectionModel
      .find(query || {})
      .skip(offset)
      .limit(limit)
      .exec();
  }

  findById(id: string) {
    return this.thirdpartyDetectionModel.findById(id);
  }

  update(
    id: string,
    updateThirdpartyDetectionDto: UpdateThirdpartyDetectionDto,
  ) {
    return this.thirdpartyDetectionModel.findByIdAndUpdate(
      id,
      updateThirdpartyDetectionDto,
      { new: true },
    );
  }

  remove(id: string) {
    return this.thirdpartyDetectionModel.findByIdAndDelete(id, { new: true });
  }
}
