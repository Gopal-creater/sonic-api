import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RadioMonitorService } from '../radiomonitor.service';
import { RadiostationService } from '../../radiostation/services/radiostation.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guards';
import { GetSubscribedRadioMonitorListLicenseValidationGuard } from 'src/api/licensekey/guards/license-validation.guard';
import { AnyApiQueryTemplate } from 'src/shared/decorators/anyapiquerytemplate.decorator';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';
import { SubscribeRadioMonitorDto } from '../dto/subscribe-radiomonitor.dto';
import { UserDB } from 'src/api/user/schemas/user.db.schema';
import { User } from '../../auth/decorators/user.decorator';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';
import { ValidatedLicense } from '../../licensekey/decorators/validatedlicense.decorator';
import { identifyDestinationFolderAndResourceOwnerFromUser } from 'src/shared/utils';
import { RadioMonitor } from '../schemas/radiomonitor.schema';
import { UnSubscribeRadioMonitorDto } from '../dto/unsubscribe-radiomonitor.dto';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { SubscribeRadioMonitorLicenseValidationGuard } from '../../licensekey/guards/license-validation.guard';

@ApiTags('Radio Monitoring & Subscription Controller')
@Controller('radiomonitors-subscription')
export class RadioMonitorController {
  constructor(
    private readonly radiomonitorService: RadioMonitorService,
    private readonly radiostationService: RadiostationService,
  ) {}

  @Get()
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subscribed radio stations' })
  async getSubscriberedStationsList(
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    return this.radiomonitorService.findAll(queryDto);
  }

  @Get('/count')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get count of all radiomonitors-subscription  also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.radiomonitorService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all radiomonitors-subscription',
  })
  async getEstimateCount() {
    return this.radiomonitorService.getEstimateCount();
  }

  @ApiOperation({
    summary: 'Get radio subscription by id',
  })
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findById(@Param('id') id: string) {
    const radioMonitor = await this.radiomonitorService.findById(id);
    if (!radioMonitor) {
      return new NotFoundException();
    }
    return radioMonitor;
  }

  @ApiOperation({
    summary: 'Subscribe radio stations',
  })
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard,SubscribeRadioMonitorLicenseValidationGuard)
  @ApiBearerAuth()
  @ApiBody({ type: SubscribeRadioMonitorDto, isArray: true })
  @Post('/subscribe-radios')
  async subscribeRadioStation(
    @Body() subscribeRadioMonitorDtos: SubscribeRadioMonitorDto[],
    @User() loggedInUser: UserDB,
    @ApiKey('_id') apiKey: string,
    @ValidatedLicense('key') licenseId: string,
  ) {
    const {
      resourceOwnerObj,
    } = identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);
    const promises = subscribeRadioMonitorDtos.map(
      async subscribeRadioMonitorDto => {
        const radioMonitorDoc: Partial<RadioMonitor> = {
          radio: subscribeRadioMonitorDto.radio,
          license: licenseId,
          apiKey: apiKey,
          ...resourceOwnerObj,
        };
        return this.radiomonitorService
          .subscribeRadioToMonitor(subscribeRadioMonitorDto.radio,licenseId,radioMonitorDoc)
          .catch(err => ({
            promiseError: err,
            data: subscribeRadioMonitorDto.radio,
          }));
      },
    );
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: string;
      }[];
      const passedData = values.filter(item => !item['promiseError']);
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }

  @ApiOperation({
    summary: 'Unsubscribe radio stations',
  })
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UnSubscribeRadioMonitorDto, isArray: true })
  @Post('/unsubscribe-radios')
  async unSubscribeRadioStation(
    @Body() unSubscribeRadioMonitorDtos: UnSubscribeRadioMonitorDto[],
  ) {
    const promises = unSubscribeRadioMonitorDtos.map(
      async unSubscribeRadioMonitorDto => {
        return this.radiomonitorService
          .unsubscribeMonitor(unSubscribeRadioMonitorDto.radioMonitor)
          .catch(err => ({
            promiseError: err,
            data: unSubscribeRadioMonitorDto.radioMonitor,
          }));
      },
    );
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: string;
      }[];
      const passedData = values.filter(item => !item['promiseError']);
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }
}
