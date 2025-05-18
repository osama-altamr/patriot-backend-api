import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalFilter implements ExceptionFilter{
  catch(exception: any, host: ArgumentsHost): any {
    const response: Response = host.switchToHttp().getResponse();
    const request: Request = host.switchToHttp().getRequest();
    console.log(exception);
    let error = {
      path: request.path,
      time: new Date(),
      message: exception.message,
      code: null,
    }
    return response.json({
      error: error,
    });
  }
}
