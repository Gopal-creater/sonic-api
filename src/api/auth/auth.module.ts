import { Module } from '@nestjs/common';
import { AuthConfig } from './config/auth.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KeygenService } from '../../shared/modules/keygen/keygen.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthConfig, AuthService, JwtStrategy, KeygenService],
  controllers: [AuthController],
})
export class AuthModule {}
