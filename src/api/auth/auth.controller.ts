import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO,WpmsUserRegisterDTO } from './dto/register.dto';
import { UserService } from '../user/services/user.service';

@ApiTags('Authentication Controller')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,public readonly userService: UserService,) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  async login(@Body() authenticateRequest: LoginDto) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('/wpms/signup')
  @ApiOperation({ summary: 'User Signup from WPMS website' })
  async wpmsSignup(@Body() wpmsUserRegisterDTO: WpmsUserRegisterDTO) {
    const{userName,email}=wpmsUserRegisterDTO
    const userFromUsername = await this.userService.findOne({$or:[{username:userName},{email:email}]})
    if(userFromUsername){
      throw new BadRequestException("User with given email or username already exists!")
    }
    return this.authService.signupWpmsUser(wpmsUserRegisterDTO)
  }
}
