export interface IServiceError {
  readonly errorType: string;
  throw(code: number, context?: any): never;
}

