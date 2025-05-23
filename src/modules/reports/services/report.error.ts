import { Injectable } from '@nestjs/common';
import { ErrorFactory } from '@Package/error';
import { IServiceError } from '@Package/error/service.error.interface';

export enum MaterialErrorCode {
    MATERIAL_NOT_FOUND = 2001,
    MATERIAL_ALREADY_EXISTS = 2002,
}

const MaterialErrorMessages = {
    [MaterialErrorCode.MATERIAL_NOT_FOUND]: 'Material not found',
    [MaterialErrorCode.MATERIAL_ALREADY_EXISTS]: 'Material already exists',
};

@Injectable()
export class MaterialError implements IServiceError {

    public readonly errorType = 'Employee_ERROR';

    throw(code: MaterialErrorCode, context?: any): never {
        const message = MaterialErrorMessages[code] || 'Unknown Employee error';
        throw ErrorFactory.createError({
            code,
            message,
            errorType: this.errorType,
        });
    }
} 