import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { ApiKeyService } from '../api-key.service';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { UpdateApiKeyDto } from '../dto/update-api-key.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { QueryDto } from '../../../shared/dtos/query.dto';

@ApiTags('Apikey-Customer Management Controller')
@Controller('api-keys/customers/:customer')
export class ApiKeyCustomerController {
  constructor(private readonly apiKeyService: ApiKeyService) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Api Key' })
  create(@Param('customer') customer:string,@Body() createApiKeyDto: CreateApiKeyDto) {
    createApiKeyDto.customer=customer
    return this.apiKeyService.create(createApiKeyDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All ApiKeys' })
  async findAll(@Param('customer') customer: string,@Query(new ParseQueryValue()) queryDto: QueryDto,) {
    const query={
      ...queryDto,
      customer:customer
    }
    return this.apiKeyService.findAll(query);
  }

  @Get(':apikey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single Api key' })
  async findOne(@Param('apikey') apikey: string) {
    const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey)
    if(!apiKey){
      throw new NotFoundException()
    }
    return apiKey
  }

  @Put(':apikey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Single Api key' })
  async update(
    @Param('apikey') apikey: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
  ) {
    const updatedApiKey = await this.apiKeyService.apiKeyModel.findOneAndUpdate({_id:apikey},updateApiKeyDto,{new:true})
    if(!updatedApiKey){
      throw new NotFoundException()
    }
    return updatedApiKey
  }

  @Put(':apikey/make-disabled')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Make this key disabled' })
  async makeDiabled(
    @Param('apikey') apikey: string
  ) {
    return this.apiKeyService.makeEnableDisable(apikey,true).catch(err=>{
      if(err.status==404){
        throw new NotFoundException()
      }
      throw err
    })
  }

  @Put(':apikey/make-enabled')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Make this key enabled' })
  async makeEnabled(
    @Param('apikey') apikey: string
  ) {
    return this.apiKeyService.makeEnableDisable(apikey,false).catch(err=>{
      if(err.status==404){
        throw new NotFoundException()
      }
      throw err
    })
  }

  @Delete(':apikey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Api key' })
  remove(@Param('apikey') apikey: string) {
    return this.apiKeyService.removeById(apikey).catch(err=>{
      if(err.status==404){
        throw new NotFoundException()
      }
      throw err
    })
  }
  
}
