import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiKey } from './schemas/api-key.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDto } from '../../shared/dtos/query.dto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectModel(ApiKey.name)
    public readonly apiKeyModel: Model<ApiKey>
  ) {}

  create(createApiKeyDto: CreateApiKeyDto) {
    const newApiKey = new this.apiKeyModel(createApiKeyDto);
    return newApiKey.save();
  }

  async makeEnableDisable(id:string,disabled:boolean){
    const oldApiKey = await this.apiKeyModel.findById(id)
    if(!oldApiKey){
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    if(oldApiKey.disabledByAdmin){
      throw new UnprocessableEntityException("Your key is disabled by admin, please contact your admin.")
    }
    return this.apiKeyModel.findOneAndUpdate({_id:id},{
      disabled:disabled
    },{new:true})
  }

  async findAll(queryDto: QueryDto = {}) {
    const { _limit, _start,_sort, ...query } = queryDto;
    var sort={}
    if(_sort){
      var sortItems = _sort?.split(',')||[]
      for (let index = 0; index < sortItems.length; index++) {
        const sortItem = sortItems[index];
        var sortKeyValue = sortItem?.split(':')
        sort[sortKeyValue[0]]=sortKeyValue[1]?.toLowerCase()=='desc' ? -1 : 1
      }
    }
    // return await this.sonicKeyModel["paginate"](query || {},options) as MongoosePaginateDto<SonicKey>
    return this.apiKeyModel
      .find(query || {})
      .skip(_start)
      .limit(_limit)
      .sort(sort)
      .exec();
  }

  async removeById(id: string) {
    const apiKey = await this.apiKeyModel.findById(id);
    if (!apiKey) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    return this.apiKeyModel.findByIdAndRemove(id);
  }
}
