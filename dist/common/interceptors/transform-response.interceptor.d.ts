import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface Response<T> {
    success: boolean;
    data: T;
    message: string;
    timestamp: string;
    path: string;
}
export declare class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>>;
}
