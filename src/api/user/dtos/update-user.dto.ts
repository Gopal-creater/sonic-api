import { ApiProperty, OmitType, PartialType,PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['userName','email','sendInvitationByEmail','isEmailVerified','isPhoneNumberVerified']),
) {
  @ApiProperty()
  enabled?: boolean;
}
