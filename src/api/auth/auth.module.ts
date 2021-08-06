import { Module } from '@nestjs/common';
import { AuthConfig } from './config/auth.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiKeyModule } from '../api-key/api-key.module';
import { LicensekeyModule } from '../licensekey/licensekey.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ApiKeyModule,
    LicensekeyModule,
  ],
  providers: [AuthConfig, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
