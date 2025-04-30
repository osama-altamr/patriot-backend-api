import { BaseValidationPipe, LocalizedString } from '@Package/api';
import { string, object } from 'zod';
import { localizedSchema } from '@Package/api/pipes';
import { z } from "zod"

export class CreateMaterialValidation extends BaseValidationPipe {
    constructor() {
        const schema = object({
            name: localizedSchema,
            description: localizedSchema,
            imageUrl: z.string().optional(),
            height: z.number().optional(),
            width: z.number().optional(),
            quantity: z.string().optional(),
            type: z.string(),
            location: z.string().optional(),
        })
        super(schema)
    }
}