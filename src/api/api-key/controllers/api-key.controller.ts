import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { ApiKeyService } from '../api-key.service';
import { AdminCreateApiKeyDto, CreateApiKeyDto } from '../dto/create-api-key.dto';
import { UpdateApiKeyDto } from '../dto/update-api-key.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { IsTargetUserLoggedInGuard } from '../../auth/guards/isTargetUserLoggedIn.guard';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { Roles, ApiKeyType } from 'src/constants/Enums';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';

/**
 * Accept this key asa x-api-key header from client side
 * https://stackoverflow.com/questions/26552149/how-to-set-x-api-key-in-the-header-of-http-get-request
 */
@ApiTags('Apikey Management Controller')
@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}
  
  @Post()
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Api Key' })
  async create(@Body() createApiKeyDto: AdminCreateApiKeyDto) {
    console.log("createApiKeyDto",createApiKeyDto)
    if(createApiKeyDto.type==ApiKeyType.INDIVIDUAL){
      const user = await this.apiKeyService.userService.getUserProfile(createApiKeyDto.customer)
      if(!user) throw new NotFoundException("Unknown user")
      createApiKeyDto.customer=user?.["UserAttributesObj"]?.sub
    }else if(createApiKeyDto.type==ApiKeyType.GROUP){
      const group = await this.apiKeyService.userService.getGroup(createApiKeyDto.groups?.[0])
      if(!group) throw new NotFoundException("Unknown group")
    }
    return this.apiKeyService.create(createApiKeyDto);
  }

  @Get()
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All ApiKeys' })
  findAll(@Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,) {
    console.log("Query",queryDto);
    
    return this.apiKeyService.findAll(queryDto);
  }

  @Get('/count')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get count of all api-keys also accept filter as query params' })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto,) {
    const filter = queryDto.filter || {}
    return this.apiKeyService.apiKeyModel.where(filter).countDocuments();
}

  @Get(':id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
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
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
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
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Api key' })
  async remove(@Param('id') id: string) {
    return this.apiKeyService.removeById(id).catch(err=>{
      if(err.status==404){
        throw new NotFoundException()
      }
      throw err
    })
  }
}
