import { BaseValidationPipe, LocalizedString } from '@Package/api';
import { nativeEnum, object } from 'zod';
import { localizedSchema } from '@Package/api/pipes';
import { string, number } from "zod"
import { MaterialType } from '../enums/material.enum';

export class CreateMaterialValidation extends BaseValidationPipe {
    constructor() {
        const schema = object({
            name: localizedSchema,
            description: localizedSchema,
            imageUrl: string().optional(),
            height: number().optional(),
            width: number().optional(),
            quantity: number().optional(),
            type: nativeEnum(MaterialType),
            location: string().optional(),
        })
        super(schema)
    }
}