import { ApiQueryOptions } from '@nestjs/swagger';
export declare function AnyApiQueryTemplate(options?: ApiQueryOptions): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
