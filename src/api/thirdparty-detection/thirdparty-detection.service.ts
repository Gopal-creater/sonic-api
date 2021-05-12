import { Injectable } from '@nestjs/common';
import { CreateThirdpartyDetectionDto } from './dto/create-thirdparty-detection.dto';
import { UpdateThirdpartyDetectionDto } from './dto/update-thirdparty-detection.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ThirdpartyDetection } from './schemas/thirdparty-detection.schema';
import { Model } from 'mongoose';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateThirdPartyDetectionDto } from './dto/mongoosepaginate-thirdpartydetection.dto';

@Injectable()
export class ThirdpartyDetectionService {
  constructor(
    @InjectModel(ThirdpartyDetection.name)
    public readonly thirdpartyDetectionModel: Model<ThirdpartyDetection>,
  ) {}

  async findAll(queryDto: ParsedQueryDto):Promise<MongoosePaginateThirdPartyDetectionDto> {
    const { limit,skip,sort,page,filter,select, populate} = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;


    return await this.thirdpartyDetectionModel["paginate"](filter,paginateOptions)
    // return this.thirdpartyDetectionModel
    //   .find(query || {})
    //   .skip(_offset)
    //   .limit(_limit)
    //   .sort(sort)
    //   .exec();
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
