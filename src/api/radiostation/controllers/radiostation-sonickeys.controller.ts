import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RadiostationService } from '../services/radiostation.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';

@ApiTags('RadioStation-SonicKeys Controller')
@Controller('radiostations-sonickeys')
export class RadiostationSonicKeysController {
  constructor(
    private readonly radiostationService: RadiostationService,
    private readonly radiostationSonicKeysService: RadiostationSonicKeysService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All radiostations-sonickeys' })
  findAll(@Query(new ParseQueryValue()) queryDto: QueryDto) {
    return this.radiostationSonicKeysService.findAll(queryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get count of all radiostation-sonickeys' })
  async getCount(@Query() query) {
    return this.radiostationSonicKeysService.radioStationSonickeyModel.estimatedDocumentCount({...query})
  }
}
