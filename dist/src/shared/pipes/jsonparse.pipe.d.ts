import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class JsonParsePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
