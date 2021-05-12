import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiKeyService } from '../api-key.service';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { UpdateApiKeyDto } from '../dto/update-api-key.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { IsTargetUserLoggedInGuard } from '../../auth/guards/isTargetUserLoggedIn.guard';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';

@ApiTags('Apikey-Customer Management Controller')
@Controller('api-keys/customers/:targetUser')
export class ApiKeyCustomerController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Api Key' })
  create(
    @Param('targetUser') customer: string,
    @Body() createApiKeyDto: CreateApiKeyDto,
  ) {
    const newApiKey = new this.apiKeyService.apiKeyModel({
      ...createApiKeyDto,
      customer: customer,
    });
    return newApiKey.save();
  }

  @Get()
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All ApiKeys' })
  async findAll(
    @Param('targetUser') customer: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    queryDto.filter["customer"]=customer
    return this.apiKeyService.findAll(queryDto);
  }

  @Get(':apikey')
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single Api key' })
  async findOne(
    @Param('targetUser') customer: string,
    @Param('apikey') apikey: string,
  ) {
    const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey);
    if (!apiKey) {
      throw new NotFoundException();
    }
    if (apiKey.customer !== customer) {
      throw new BadRequestException('You are not the owner of this api key');
    }
    return apiKey;
  }

  @Put(':apikey')
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Single Api key' })
  async update(
    @Param('targetUser') customer: string,
    @Param('apikey') apikey: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
  ) {
    const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey);
    if (!apiKey) {
      throw new NotFoundException();
    }
    if (apiKey.customer !== customer) {
      throw new BadRequestException('You are not the owner of this api key');
    }
    return this.apiKeyService.apiKeyModel.findOneAndUpdate(
      { _id: apikey },
      updateApiKeyDto,
      { new: true },
    );
  }

  @Put(':apikey/make-disabled')
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Make this key disabled' })
  async makeDiabled(
    @Param('targetUser') customer: string,
    @Param('apikey') apikey: string,
  ) {
    const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey);
    if (!apiKey) {
      throw new NotFoundException();
    }
    if (apiKey.customer !== customer) {
      throw new BadRequestException('You are not the owner of this api key');
    }
    return this.apiKeyService.makeEnableDisable(apikey, true);
  }

  @Put(':apikey/make-enabled')
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Make this key enabled' })
  async makeEnabled(
    @Param('targetUser') customer: string,
    @Param('apikey') apikey: string,
  ) {
    const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey);
    if (!apiKey) {
      throw new NotFoundException();
    }
    if (apiKey.customer !== customer) {
      throw new BadRequestException('You are not the owner of this api key');
    }
    return this.apiKeyService.makeEnableDisable(apikey, false);
  }

  @Delete(':apikey')
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Api key' })
  async remove(
    @Param('targetUser') customer: string,
    @Param('apikey') apikey: string,
  ) {
    const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey);
    if (!apiKey) {
      throw new NotFoundException();
    }
    if (apiKey.customer !== customer) {
      throw new BadRequestException('You are not the owner of this api key');
    }
    return this.apiKeyService.removeById(apikey);
  }
}
