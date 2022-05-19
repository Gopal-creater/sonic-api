import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO, WpmsUserRegisterDTO } from './dto/register.dto';
import { UserService } from '../user/services/user.service';
import { PartnerService } from '../partner/services/partner.service';

@ApiTags('Authentication Controller (D & M May 2022)')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    public readonly userService: UserService,
    private readonly partnerService: PartnerService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  async login(@Body() loginDto: LoginDto) {
    const {userName,password}=loginDto
      return  this.authService.login(userName,password);
  }

  
  @Post('/wpms/signup')
  @ApiOperation({ summary: 'User Signup from WPMS website under WPMS Partner' })
  async wpmsSignup(@Body() wpmsUserRegisterDTO: WpmsUserRegisterDTO) {
    const { userName, email } = wpmsUserRegisterDTO;
    const userFromUsername = await this.userService.findOne({
      $or: [{ username: userName }, { email: email }],
    });
    if (userFromUsername) {
      throw new BadRequestException(
        'User with given email or username already exists!',
      );
    }
    return this.authService.signupWpmsUser(wpmsUserRegisterDTO);
  }
}
