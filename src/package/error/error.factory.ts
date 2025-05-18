import { AppError } from "./app.error";
import { IError } from "./error.interface";

export class ErrorFactory {
    public static createError(error: IError): AppError {
        return new AppError(error);
    }

}