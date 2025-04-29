import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { ZodError } from 'zod';
import { IResponseError } from '@Package/error/error.interface'; 
import { CodeErrors } from '@Package/shared';

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ZodExceptionFilter.name, { timestamp: false });

  catch(exception: ZodError, host: ArgumentsHost): void {
    const response: Response = host.switchToHttp().getResponse();
    const request: Request = host.switchToHttp().getRequest();

    const firstIssue = exception.issues[0];
    const errorMessage = firstIssue.path[0] + " " + firstIssue?.message || 'Validation error';

    const errorResponse: IResponseError = {
      path: request.path,
      time: new Date(),
      message: errorMessage,
      code: CodeErrors.VALIDATION_ERROR,
      errorType: 'VALIDATION_ERROR',
    };

    this.logger.error(`[Validation Error] ${errorMessage}`, {
      path: request.path,
      field: firstIssue?.path?.join('.'),
      issues: exception.issues,
    });

    response.status(400).json({ error: errorResponse });
  }
}
