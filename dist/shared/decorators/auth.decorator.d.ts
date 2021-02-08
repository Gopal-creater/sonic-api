import { RolesEnum } from './../enums/role.enum';
import { CanActivate } from '@nestjs/common';
export declare function Auth(rules?: {
    additionalGuards?: (Function | CanActivate)[];
    roles?: RolesEnum[];
}): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
