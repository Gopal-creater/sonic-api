import { ApiProperty, OmitType, PartialType,PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateProfileDto extends PartialType(
  OmitType(CreateUserDto, ['userName','email','sendInvitationByEmail','isEmailVerified','isPhoneNumberVerified','partner','company','password','userRole']),
) {
}
