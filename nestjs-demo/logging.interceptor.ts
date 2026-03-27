import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const start = Date.now();

    console.log(`[Interceptor] ${method} ${url} - before handler`);

    return next.handle().pipe(
      tap(() =>
        console.log(
          `[Interceptor] ${method} ${url} - ${Date.now() - start}ms`,
        ),
      ),
    );
  }
}