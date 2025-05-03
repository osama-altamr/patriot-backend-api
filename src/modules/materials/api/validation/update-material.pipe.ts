import { BaseValidationPipe, LocalizedString } from '@Package/api';
import { number, object, string } from 'zod';
import { localizedSchema } from '@Package/api/pipes';

export class UpdateMaterialValidation extends BaseValidationPipe {
    constructor() {
        const schema = object({
            name: localizedSchema.optional(),
            description: localizedSchema.optional(),
            imageUrl: string().optional(),
            height: number().optional(),
            width: number().optional(),
            quantity: number().optional(),
            type: string().optional(),
            location: string().optional(),
        })
        super(schema)
    }
}