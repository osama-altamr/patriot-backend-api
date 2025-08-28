import { BaseValidationPipe, LocalizedString } from '@Package/api';
import { nativeEnum, object } from 'zod';
import { localizedSchema } from '@Package/api/pipes';
import { string, number } from "zod"
import { MaterialGlassType, MaterialType } from '../enums/material.enum';

export class CreateMaterialValidation extends BaseValidationPipe {
    constructor() {
        const schema = object({
            name: localizedSchema,
            description: localizedSchema,
            imageUrl: string().optional().nullable(),
            height: number().optional(),
            width: number().optional(),
            quantity: number().optional(),
            glassType: nativeEnum(MaterialGlassType).nullable().optional(),
            type: nativeEnum(MaterialType).optional().default(MaterialType.glass),
            location: string().optional(),
        })
        super(schema)
    }
}