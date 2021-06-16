/// <reference types="mongoose" />
import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ToObjectIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): import("mongoose").Types.ObjectId;
}
