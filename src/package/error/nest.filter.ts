import { AppExceptionFilter } from "./exceptions/app-exception.filter";
import { GlobalFilter } from "./exceptions/global.filter";
import { ZodExceptionFilter } from "./exceptions/zod-exception.filter";
import { HttpExceptionFilter } from "./exceptions/http-exception.filter";
import { ExceptionFilter } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";


const ExceptionFilters: ExceptionFilter[] = [
    new GlobalFilter(),
    new HttpExceptionFilter(),
    new AppExceptionFilter(),
    new ZodExceptionFilter(),
];

export const nestjsFilter = (nest: NestApplication) => {
    return nest.useGlobalFilters(...ExceptionFilters)
}