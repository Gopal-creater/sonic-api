import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ParseQueryValue implements PipeTransform {
    private values?;
    constructor(values?: string[]);
    transform(queries: any, metadata: ArgumentMetadata): {};
}