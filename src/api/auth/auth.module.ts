import { Module } from '@nestjs/common';
import { AuthConfig } from './config/auth.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiKeyModule } from '../api-key/api-key.module';
import { LicensekeyModule } from '../licensekey/licensekey.module';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiKeyAuthGuard } from './guards/apikey-auth.guard';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
  PassportModule.register({ defaultStrategy: 'jwt' }),
    ApiKeyModule,
    LicensekeyModule,
    UserModule,
    CompanyModule
  ],
  providers: [
    AuthConfig,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    ApiKeyAuthGuard,
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, ApiKeyAuthGuard,CompanyModule],
})
export class AuthModule {}
