import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RadioMonitorService } from '../radiomonitor.service';
import { CreateRadioMonitorDto } from '../dto/create-radiomonitor.dto';
import { User } from '../../auth/decorators';
import { RadiostationService } from '../../radiostation/services/radiostation.service';
import { ApiBody, ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BulkByIdsDto } from '../../../shared/dtos/bulk.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { JwtAuthGuard } from 'src/api/auth/guards';
import { SubscribeRadioMonitorLicenseValidationGuard } from 'src/api/licensekey/guards/license-validation.guard';
import { ValidatedLicense } from '../../licensekey/decorators/validatedlicense.decorator';

@ApiTags('Radio Monitoring Controller')
@Controller('radiomonitors')
export class RadioMonitorOwnerController {
  constructor(
    private readonly radiomonitorService: RadioMonitorService,
    private readonly radiostationService: RadiostationService,
  ) {}

  @Post('/owners/:ownerId/subscribe')
  @UseGuards(JwtAuthGuard,SubscribeRadioMonitorLicenseValidationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe the radio monitoring' })
  async subscribe(
    @Body() createRadiomonitorDto: CreateRadioMonitorDto,
    @User('sub') owner: string,
    @ValidatedLicense('key') license: string,
  ) {
    const { radio } = createRadiomonitorDto;
    await this.radiostationService.findByIdOrFail(radio);
    return this.radiomonitorService.subscribeRadioToMonitor(
      createRadiomonitorDto,
      owner,
      license,
    );
  }

  @Post('/owners/:ownerId/subscribe-bulk')
  @UseGuards(JwtAuthGuard,SubscribeRadioMonitorLicenseValidationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe the BULK radio monitoring' })
  @ApiBody({ type: [CreateRadioMonitorDto] })
  async subscribeBulk(
    @Body() createRadiomonitorsDto: CreateRadioMonitorDto[],
    @User('sub') owner: string,
    @ValidatedLicense('key') license: string,
  ) {
    return this.radiomonitorService.subscribeRadioToMonitorBulk(
      createRadiomonitorsDto,
      owner,
      license,
    );
  }

  @Put(':id/owners/:ownerId/stop-listening-stream')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Stop listening for stream' })
  async stopListeningStream(@Param('id') id: string) {
    await this.radiomonitorService.findByIdOrFail(id);
    return this.radiomonitorService.stopListeningStream(id);
  }

  @Put('owners/:ownerId/stop-listening-stream-bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Stop listening for stream bulk' })
  async stopListeningStreamBulk(@Body() bulkDto: BulkByIdsDto) {
    const { ids } = bulkDto;
    return this.radiomonitorService.stopListeningStreamBulk(ids);
  }

  @Put(':id/owners/:ownerId/start-listening-stream')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start listening for stream' })
  async startListeningStream(@Param('id') id: string) {
    await this.radiomonitorService.findByIdOrFail(id);
    return this.radiomonitorService.startListeningStream(id);
  }

  @Put('owners/:ownerId/start-listening-stream-bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start listening for stream' })
  async startListeningStreamBulk(@Body() bulkDto: BulkByIdsDto) {
    const { ids } = bulkDto;
    return this.radiomonitorService.startListeningStreamBulk(ids);
  }

  @Get('owners/:ownerId/subscriber-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get counts with filter eg: ?isListeningStarted=true OR ?isError=true etc..' })
  async getSubscriberCount(
    @User('sub') owner: string,
    @Param('ownerId') ownerId: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    const filter = queryDto.filter || {};
    filter['owner'] = ownerId;
    return this.radiomonitorService.radioMonitorModel
      .where(filter)
      .countDocuments();
  }

  @Delete(':id/owners/:ownerId/unsubscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Un-subscribe the radio monitoring' })
  async unsubscribe(@Param('id') id: string) {
    await this.radiomonitorService.findByIdOrFail(id);
    return this.radiomonitorService.unsubscribeById(id);
  }

  @Delete('owners/:ownerId/unsubscribe-bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Un-subscribe the BULK radio monitoring' })
  async unsubscribeBulk(@Body() bulkDto: BulkByIdsDto) {
    const { ids } = bulkDto;
    return this.radiomonitorService.unsubscribeBulk(ids);
  }
}
