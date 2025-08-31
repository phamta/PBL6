import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip;
    
    const now = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${url} - ${userAgent} ${ip}`,
      {
        body: this.sanitizeBody(body),
        query,
        params,
      }
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const contentLength = response.get('content-length');
          
          this.logger.log(
            `Response: ${method} ${url} ${statusCode} ${contentLength} - ${Date.now() - now}ms`
          );
        },
        error: (error) => {
          this.logger.error(
            `Error Response: ${method} ${url} - ${Date.now() - now}ms`,
            error.message
          );
        },
      })
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    });
    
    return sanitized;
  }
}
