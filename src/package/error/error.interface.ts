
export interface IError {
  message: string | object;
  code: number;
  errorType?: string;

}

export interface IResponseError extends IError {
  path: string;
  time: Date;
}
