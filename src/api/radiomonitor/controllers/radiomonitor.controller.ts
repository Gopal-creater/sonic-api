import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RadioMonitorService } from '../radiomonitor.service';
import { RadiostationService } from '../../radiostation/services/radiostation.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guards';
import { GetSubscribedRadioMonitorListLicenseValidationGuard } from 'src/api/licensekey/guards/license-validation.guard';
import { AnyApiQueryTemplate } from 'src/shared/decorators/anyapiquerytemplate.decorator';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';

@ApiTags('Radio Monitoring Controller')
@Controller('radiomonitors')
export class RadioMonitorController {
  constructor(
    private readonly radiomonitorService: RadioMonitorService,
    private readonly radiostationService: RadiostationService,
  ) {}

  @Get('/subscribed-stations-list')
  @UseGuards(JwtAuthGuard, GetSubscribedRadioMonitorListLicenseValidationGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subscribed radio stations' })
  async getSubscriberedStationsList(
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    return this.radiostationService.findAll(queryDto);
  }

  @Get('/subscribed-stations-count')
  @UseGuards(JwtAuthGuard, GetSubscribedRadioMonitorListLicenseValidationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get counts of subscribed stations.' })
  async getSubscribedStationsCount(
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    return this.radiostationService.getCount(queryDto);
  }
}
