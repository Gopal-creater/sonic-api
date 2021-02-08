import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class ValidationInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
