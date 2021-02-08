import { KeygenModule } from './../../shared/modules/keygen/keygen.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports:[KeygenModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
