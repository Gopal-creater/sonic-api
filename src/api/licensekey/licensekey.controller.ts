import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { LicensekeyService } from './licensekey.service';
import { CreateLicensekeyDto } from './dto/create-licensekey.dto';
import { UpdateLicensekeyDto } from './dto/update-licensekey.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("License Keys Management")
@Controller('licensekey')
export class LicensekeyController {
  constructor(private readonly licensekeyService: LicensekeyService) {}
  
  @Post()
  create(@Body() createLicensekeyDto: CreateLicensekeyDto) {
    return this.licensekeyService.create(createLicensekeyDto);
  }

  @Get()
  findAll() {
    return this.licensekeyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licensekeyService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLicensekeyDto: UpdateLicensekeyDto) {
    return this.licensekeyService.update(+id, updateLicensekeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licensekeyService.remove(+id);
  }
}
