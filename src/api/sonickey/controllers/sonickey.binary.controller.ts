import {CreateSonicKeyFromBinaryDto } from '../dtos/create-sonickey.dto';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException
} from '@nestjs/common';
import { SonickeyService } from '../services/sonickey.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiSecurity
} from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';
import { BinaryLicenseValidationGuard } from '../../auth/guards/binary-license-validation.guard';
import { ApiKey } from '../../auth/decorators/apikey.decorator';
import { ChannelEnums } from '../../../constants/Channels.enum';
import { LicenseKey } from '../../auth/decorators/licensekey.decorator';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';

/**
 * Prabin:
 * Our DynamoDb table has a sonickey as a hash key. So we can perform all CURD using sonickey.
 * To get all owner's sonickeys we have to create a global secondary index table.
 */

@ApiTags('SonicKeys ThirdParty-Binary Controller (protected by x-api-key)')
@ApiSecurity('x-api-key')
@Controller('sonic-keys/binary')
export class SonickeyBinaryController {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    private readonly licensekeyService: LicensekeyService,
  ) {}

  @UseGuards(ApiKeyAuthGuard, BinaryLicenseValidationGuard)
  @Post('/create-from-binary')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save to database after local encode from binary.' })
  async createFormBinary(
    @Body() createSonicKeyDto: CreateSonicKeyFromBinaryDto,
    @ApiKey('customer') customer: string,
    @ApiKey('_id') apiKey: string,
    @LicenseKey('key') licenseKey: string
  ) {
    const channel = ChannelEnums.BINARY
    const newSonicKey = new this.sonicKeyService.sonicKeyModel({
      ...createSonicKeyDto,
      owner:customer,
      apiKey:apiKey,
      channel:channel,
      license: licenseKey,
      _id:createSonicKeyDto.sonicKey
    });
    const savedSonicKey = await newSonicKey.save();
     await this.licensekeyService.incrementUses(licenseKey,"encode", 1)
     .catch(async err=>{
      await this.sonicKeyService.sonicKeyModel.deleteOne({_id:savedSonicKey.id})
      throw new BadRequestException(
        'Unable to increment the license usage!',
      );
     })
    return savedSonicKey
  }
}
