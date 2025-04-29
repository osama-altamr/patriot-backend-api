import { IError } from '@Package/error/error.interface';

export class AppError extends Error implements IError {
  public readonly code: number;
  public readonly errorType: string;

  constructor(error: IError) {
    super(error.message as string);
    this.code = error.code;
    this.errorType = error.errorType;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
