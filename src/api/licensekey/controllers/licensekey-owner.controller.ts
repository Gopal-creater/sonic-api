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
import { LicensekeyService } from '../services/licensekey.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/api/auth/decorators';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { Roles } from 'src/constants/Enums';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { AddOwnerDto } from '../dto/owner/owner.dto';
import { LKOwner } from '../schemas/licensekey.schema';

@ApiTags('License Keys Owner Management Controller')
@Controller('license-keys/:licenseId/owners')
export class LicensekeyOwnerController {
  constructor(private readonly licensekeyService: LicensekeyService) {}

  @Put()
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Owner to the license' })
  async create(
    @Body() addOwnerDto: AddOwnerDto,
    @Param('licenseId') licenseId: string,
    @User('sub') updatedBy: string,
  ) {
    const key = await this.licensekeyService.licenseKeyModel.findById(
      licenseId,
    );
    if (!key) throw new NotFoundException('License not found');
    const user = await this.licensekeyService.userService.getUserProfile(
      addOwnerDto.usernameOrSub,
    );
    if (!user) throw new NotFoundException('User not found');
    
    const updatedLicense = await this.licensekeyService.addOwnerToLicense(
      licenseId,
      user.sub,
    );
    await this.licensekeyService.licenseKeyModel.findOneAndUpdate(
      { _id: licenseId },
      { updatedBy: updatedBy },
      { new: true },
    );
    return updatedLicense;
  }

  @Delete(':usernameOrSub')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete User from this license' })
  async remove(
    @Param('licenseId') licenseId: string,
    @Param('usernameOrSub') usernameOrSub: string,
  ) {
    const key = await this.licensekeyService.licenseKeyModel.findById(
      licenseId,
    );
    if (!key) throw new NotFoundException('License not found');
    const user = await this.licensekeyService.userService.getUserProfile(
      usernameOrSub,
    );
    if (!user) throw new NotFoundException('User not found');
    
    return this.licensekeyService.removeOwnerFromLicense(licenseId, user.sub);
  }
}
