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
} from '@nestjs/common';
import { ApiKeyService } from '../api-key.service';
import {
  AdminCreateApiKeyDto
} from '../dto/create-api-key.dto';
import { UpdateApiKeyDto } from '../dto/update-api-key.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { IsTargetUserLoggedInGuard } from '../../auth/guards/isTargetUserLoggedIn.guard';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { Roles, ApiKeyType } from 'src/constants/Enums';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { User } from 'src/api/auth/decorators';
import { UserDB } from 'src/api/user/schemas/user.db.schema';
import { ApiKey } from 'src/api/api-key/schemas/api-key.schema';

/**
 * Accept this key asa x-api-key header from client side
 * https://stackoverflow.com/questions/26552149/how-to-set-x-api-key-in-the-header-of-http-get-request
 */
@ApiTags('Apikey Management Controller')
@Controller({
  path: 'api-keys',
})
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Api Key' })
  async create(@User() loggedInUser: UserDB ,@Body() createApiKeyDto: AdminCreateApiKeyDto) {
    const doc: Partial<ApiKey> = {
      ...createApiKeyDto,
      createdBy: loggedInUser?.sub,
    };
    if (createApiKeyDto.type == ApiKeyType.INDIVIDUAL) {
      const user = await this.apiKeyService.userService.getUserProfile(
        createApiKeyDto.customer,
      );
      if (!user) throw new NotFoundException('Unknown user');
      createApiKeyDto.customer = user?.sub;
      delete createApiKeyDto.company
    } else if (createApiKeyDto.type == ApiKeyType.COMPANY) {
      const company = await this.apiKeyService.companyService.findById(
        createApiKeyDto.company,
      );
      if (!company) throw new NotFoundException('Unknown company');

      if (!company?.owner?.sub)
        throw new NotFoundException(
          'The given company doesnot have any valid admin user',
        );
      doc.customer = company.owner.sub //TODO: Remove
    }
    return this.apiKeyService.create(doc);
  }

  @Get()
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All ApiKeys' })
  findAll(@Query(new ParseQueryValue()) queryDto?: ParsedQueryDto) {
    return this.apiKeyService.findAll(queryDto);
  }

  @Get(':id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single Api key' })
  async findOne(@Param('id') id: string) {
    const apiKey = await this.apiKeyService.findById(id);
    if (!apiKey) {
      throw new NotFoundException();
    }
    return apiKey;
  }

  @Put(':id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Single Api key' })
  async update(
    @Param('id') id: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
    @User('sub') updatedBy: string,
  ) {
    const apiKey = await this.apiKeyService.findById(id);
    if (!apiKey) {
      throw new NotFoundException();
    }
    const updatedKey = await this.apiKeyService.update(id, {
      ...updateApiKeyDto,
      updatedBy: updatedBy,
    });
    return updatedKey;
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all apikeys also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.apiKeyService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all apikeys',
  })
  async getEstimateCount() {
    return this.apiKeyService.getEstimateCount();
  }

  @Delete(':id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Api key' })
  async remove(@Param('id') id: string) {
    const apiKey = await this.apiKeyService.findById(id);
    if (!apiKey) {
      throw new NotFoundException();
    }
    return this.apiKeyService.removeById(id);
  }
}
