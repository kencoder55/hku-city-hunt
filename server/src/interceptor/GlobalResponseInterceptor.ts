import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../response/ApiResponse';
import { FailureException } from '../exception/FailureException';
import { SuccessException } from '../exception/SuccessException';

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof SuccessException) {
          return new ApiResponse(true, data.message, data.result);
        } else if (data instanceof FailureException) {
          return new ApiResponse(false, data.message, data.result);
        } else {
          return new ApiResponse(true, '', data);
        }
      }),
    );
  }
}
