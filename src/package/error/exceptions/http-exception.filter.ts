import { ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException } from '@nestjs/common';
import { Response, Request } from 'express';
import { IResponseError } from '@Package/error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
  catch(exception: HttpException, host: ArgumentsHost): any {
    const response: Response = host.switchToHttp().getResponse();
    const request: Request = host.switchToHttp().getRequest();
    let error: IResponseError = {
      path: request.path,
      time: new Date(),
      message: exception.message,
      code: exception.getStatus(),
    }
    return response.status(400).json({
      error: error,
    });
  }
}
