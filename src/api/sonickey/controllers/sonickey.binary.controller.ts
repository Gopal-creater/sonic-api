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
import { ChannelEnums } from '../../../constants/Enums';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';
import { ValidatedLicense } from '../../licensekey/decorators/validatedlicense.decorator';
import { LicenseValidationGuard } from '../../licensekey/guards/license-validation.guard';
import { User } from '../../auth/decorators/user.decorator';

//REMOVABLE:  Added on thirdparty-controller

@ApiTags('SonicKeys ThirdParty-Binary Controller (protected by x-api-key)')
@ApiSecurity('x-api-key')
@Controller('sonic-keys/binary')
export class SonickeyBinaryController {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    private readonly licensekeyService: LicensekeyService,
  ) {}

  @UseGuards(ApiKeyAuthGuard, LicenseValidationGuard)
  @Post('/create-from-binary')
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Save to database after local encode from binary.' })
  async createFormBinary(
    @Body() createSonicKeyDto: CreateSonicKeyFromBinaryDto,
    @User('sub') customer: string,
    @ApiKey('_id') apiKey: string,
    @ValidatedLicense('key') licenseKey: string
  ) {
    const channel = ChannelEnums.BINARY
    const newSonicKey = {
      ...createSonicKeyDto,
      owner:customer,
      apiKey:apiKey,
      channel:channel,
      license: licenseKey,
      _id:createSonicKeyDto.sonicKey
    };
    const savedSonicKey = await this.sonicKeyService.createFromBinaryForUser(customer,newSonicKey)
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
