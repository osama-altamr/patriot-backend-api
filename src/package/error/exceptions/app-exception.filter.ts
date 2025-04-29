import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppError } from '@Package/error';
import { IResponseError } from '@Package/error/error.interface'; 

@Catch(AppError)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost): void {
    const response: Response = host.switchToHttp().getResponse();
    const request: Request = host.switchToHttp().getRequest();
    
    const errorResponse: IResponseError = {
      path: request.path,
      time: new Date(),
      message: exception.message,
      code: exception.code,
      errorType: exception.errorType, 
    };

    console.error(`[${new Date().toISOString()}] [${exception.errorType}] ${exception.message}`, {
      path: request.path,
      errorCode: exception.code,
    });

    response.status(400).json({ error: errorResponse });
  }
}
