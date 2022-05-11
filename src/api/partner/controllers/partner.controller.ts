import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PartnerService } from '../services/partner.service';
import { CreatePartnerDto } from '../dto/create-partner.dto';
import { UpdatePartnerDto } from '../dto/update-partner.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ParseQueryValue } from 'src/shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';

@ApiTags('Partners Controller')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiOperation({ summary: 'Create partner' })
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    if (createPartnerDto.owner) {
      const user = await this.partnerService.userService.getUserProfile(
        createPartnerDto.owner,
      );
      if (!user) throw new NotFoundException('Unknown user');
      const isalreadyOwnPartner = await this.partnerService.findOne({
        owner: createPartnerDto.owner,
      });
      if (isalreadyOwnPartner || user.adminPartner)
        throw new NotFoundException(
          'Given user already own the company, please choose different user',
        );
    }

    return this.partnerService.create(createPartnerDto);
  }

  @ApiOperation({
    summary: 'Get partners',
  })
  @Get()
  findAll(
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    return this.partnerService.findAll(queryDto);
  }

  @ApiOperation({
    summary: 'Get partner by id',
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.partnerService.findById(id);
  }

  @Put(':id/change-partner-admin-user')
  @ApiOperation({ summary: 'Change admin user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: { type: 'string' },
      },
    },
  })
  async changeAdminUser(
    @Param('id') partner: string,
    @Body('user') user: string,
  ) {
    const userFromDb = await this.partnerService.userService.getUserProfile(
      user,
    );
    if (!userFromDb) throw new NotFoundException('Unknown user');
    if (userFromDb.adminPartner) {
      throw new UnprocessableEntityException(
        'Given user already own the partner, please choose different user as a partner admin',
      );
    }
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');
    return this.partnerService.makePartnerAdminUser(user, partner);
  }

  @ApiOperation({
    summary: 'Update partner by id',
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Get('/count')
  @ApiOperation({
    summary: 'Get count of all partners also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.partnerService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @ApiOperation({
    summary: 'Get all count of all partners',
  })
  async getEstimateCount() {
    return this.partnerService.getEstimateCount();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove partner' })
  remove(@Param('id') id: string) {
    return this.partnerService.removeById(id);
  }
}
