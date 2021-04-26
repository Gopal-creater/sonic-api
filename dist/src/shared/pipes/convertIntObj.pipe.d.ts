import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ConvertIntObj implements PipeTransform {
    private values?;
    constructor(values?: string[]);
    transform(value: any, metadata: ArgumentMetadata): {};
}
