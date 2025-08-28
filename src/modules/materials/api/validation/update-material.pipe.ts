import { BaseValidationPipe, LocalizedString } from '@Package/api';
import { nativeEnum, number, object, string, z } from 'zod';
import { localizedSchema } from '@Package/api/pipes';
import { MaterialGlassType } from '../enums/material.enum';

export class UpdateMaterialValidation extends BaseValidationPipe {
    constructor() {
        const schema = object({
            name: localizedSchema.optional(),
            description: localizedSchema.optional(),
            imageUrl: string().optional().nullable(),
            height: z.preprocess(
                (val) => (String(val).trim() === "" ? undefined : val),
                z.coerce.number().positive().optional().nullable()
            ),
            width: z.preprocess(
                (val) => (String(val).trim() === "" ? undefined : val),
                z.coerce.number().positive().optional().nullable()
            ),
            quantity: z.preprocess(
                (val) => (String(val).trim() === "" ? undefined : val),
                z.coerce.number().int().positive().optional().nullable()
            ),
            type: string().optional(),
            glassType: nativeEnum(MaterialGlassType).nullable().optional(),
            location: string().nullable().optional(),
        })
        super(schema)
    }
}