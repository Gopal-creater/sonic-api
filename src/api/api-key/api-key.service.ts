import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { AdminCreateApiKeyDto } from './dto/create-api-key.dto';
import { AdminUpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiKey } from './schemas/api-key.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateApiKeyDto } from './dto/mongoosepaginate-apikey.dto';
import { UserService } from '../user/services/user.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectModel(ApiKey.name)
    public readonly apiKeyModel: Model<ApiKey>,

    public readonly userService: UserService,
    public readonly companyService: CompanyService
  ) {}

  async create(createApiKeyDto: AdminCreateApiKeyDto) {
    const newApiKey = await this.apiKeyModel.create(createApiKeyDto);
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
    if(oldApiKey.suspended){
      throw new UnprocessableEntityException("Your key is suspended, please contact your admin.")
    }
    return this.apiKeyModel.findOneAndUpdate({_id:id},{
      disabled:disabled
    },{new:true})
  }

  async findAll(queryDto: ParsedQueryDto):Promise<MongoosePaginateApiKeyDto> {
    const { limit,skip,sort,page,filter,select, populate} = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;


    return await this.apiKeyModel["paginate"](filter,paginateOptions)
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.apiKeyModel
      .find(filter || {})
      .count()
  }

  findOne(filter: FilterQuery<ApiKey>) {
    return this.apiKeyModel.findOne(filter);
  }

  findById(id: string) {
    return this.apiKeyModel.findById(id);
  }

  update(id: string, updateUserDto: AdminUpdateApiKeyDto) {
    return this.apiKeyModel.findByIdAndUpdate(id, updateUserDto,{new:true});
  }

  async getEstimateCount() {
    return this.apiKeyModel.estimatedDocumentCount()
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
