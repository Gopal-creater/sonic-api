import { ApiQueryOptions } from '@nestjs/swagger';
export declare function AnyApiQueryTemplate(options?: {
    apiQuery?: ApiQueryOptions;
    additionalHtmlDescription?: string;
    removeOldDescription?: boolean;
}): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
