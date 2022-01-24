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
import { RegisterDTO } from './dto/register.dto';
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
}
