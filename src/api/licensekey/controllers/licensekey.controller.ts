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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LicensekeyService } from '../licensekey.service';
import { CreateLicensekeyDto } from '../dto/create-licensekey.dto';
import { UpdateLicensekeyDto } from '../dto/update-licensekey.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';

@ApiTags('License Keys Management Controller')
@Controller('license-keys')
export class LicensekeyController {
  constructor(private readonly licensekeyService: LicensekeyService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create License Key' })
  create(@Body() createLicensekeyDto: CreateLicensekeyDto) {
    return this.licensekeyService.create(createLicensekeyDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All LicenseJKeys' })
  findAll(@Query(new ParseQueryValue()) queryDto?: ParsedQueryDto) {
    return this.licensekeyService.findAll(queryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all license-keys also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    const filter = queryDto.filter || {};
    return this.licensekeyService.licenseKeyModel
      .where(filter)
      .countDocuments();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single License key' })
  async findOne(@Param('id') id: string) {
    const licenseKey = await this.licensekeyService.licenseKeyModel.findById(
      id,
    );
    if (!licenseKey) {
      throw new NotFoundException();
    }
    return licenseKey;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Single License key' })
  async update(
    @Param('id') id: string,
    @Body() updateLicensekeyDto: UpdateLicensekeyDto,
  ) {
    const updatedKey = await this.licensekeyService.licenseKeyModel.findOneAndUpdate(
      { _id: id },
      updateLicensekeyDto,
      { new: true },
    );
    if (!updatedKey) {
      throw new NotFoundException();
    }
    return updatedKey;
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete License key' })
  remove(@Param('id') id: string) {
    return this.licensekeyService.licenseKeyModel.findByIdAndRemove(id);
  }
}
