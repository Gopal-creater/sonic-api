import { Injectable, forwardRef, Inject } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../services/user.service';
import { UserSchema, RawUserModel } from '../schemas/user.db.schema';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
  constructor(
    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
  ) {}

  async validate(value: string, args?: ValidationArguments) {
    console.log('args', args);
    const user = await RawUserModel.findOne({_id:value})
    console.log("user",user)
    return Boolean(user);
  }

  defaultMessage(args: ValidationArguments) {
    return `User doesn't exist`;
  }
}

export function UserExists(validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'UserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserExistsRule,
    });
  };
}
