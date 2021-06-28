import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { ApiKeyService } from '../api-key.service';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { UpdateApiKeyDto } from '../dto/update-api-key.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { IsTargetUserLoggedInGuard } from '../../auth/guards/isTargetUserLoggedIn.guard';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';

/**
 * Accept this key asa x-api-key header from client side
 * https://stackoverflow.com/questions/26552149/how-to-set-x-api-key-in-the-header-of-http-get-request
 */
@ApiTags('Apikey Management Controller')
@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Api Key' })
  create(@Body() createApiKeyDto: CreateApiKeyDto) {
    return this.apiKeyService.create(createApiKeyDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard,new IsTargetUserLoggedInGuard())
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All ApiKeys' })
  findAll(@Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,) {
    console.log("Query",queryDto);
    
    return this.apiKeyService.findAll(queryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get count of all api-keys also accept filter as query params' })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto,) {
    const filter = queryDto.filter || {}
    return this.apiKeyService.apiKeyModel.where(filter).countDocuments();
}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single Api key' })
  async findOne(@Param('id') id: string) {
    const apiKey = await this.apiKeyService.apiKeyModel.findById(id)
    if(!apiKey){
      throw new NotFoundException()
    }
    return apiKey
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Single Api key' })
  async update(
    @Param('id') id: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
  ) {
    const updatedApiKey = await this.apiKeyService.apiKeyModel.findOneAndUpdate({_id:id},updateApiKeyDto,{new:true})
    if(!updatedApiKey){
      throw new NotFoundException()
    }
    return updatedApiKey
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Api key' })
  remove(@Param('id') id: string) {
    return this.apiKeyService.removeById(id).catch(err=>{
      if(err.status==404){
        throw new NotFoundException()
      }
      throw err
    })
  }
}
