import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(`${method} ${url} ${Date.now() - now}ms`);
        },
        error: (err) => {
          this.logger.error(
            `${method} ${url} ${Date.now() - now}ms`,
            err.message,
          );
        },
      }),
    );
  }
}
