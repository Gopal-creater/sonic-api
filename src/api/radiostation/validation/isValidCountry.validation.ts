import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as countries from '../../../constants/countries.json';

@ValidatorConstraint({ async: true })
export class IsValidCountryConstraint implements ValidatorConstraintInterface {
  validate(incommingCountry: any, args: ValidationArguments) {
    const foundCountry = countries.find(
      country => country.name == incommingCountry,
    );
    if (!foundCountry) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `Country ${args.value} is not a valid formated country`;
  }
}

export function IsValidCountry(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCountryConstraint,
    });
  };
}
