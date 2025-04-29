import {CallHandler, ExecutionContext, NestInterceptor} from "@nestjs/common";
import {Observable, map} from "rxjs";

export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map(data => ({ data })));
  }

}