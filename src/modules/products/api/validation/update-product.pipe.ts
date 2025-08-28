import { BaseValidationPipe } from '@Package/api'
import { string, object,z, number } from 'zod'
import { localizedSchema } from '@Package/api/pipes/localized.pipe' 
import { UpdateProductDto } from '../dto/request/update-product.dto'

export class UpdateProductValidation extends BaseValidationPipe<UpdateProductDto> {
  constructor() {
    const schema = object({
       name: localizedSchema.optional(),
       description: localizedSchema.optional(),
       imageUrl: string().url().optional().nullable(), 
        height: z.preprocess(
                       (val) => (String(val).trim() === "" ? undefined : val),
                       z.coerce.number().positive().optional().nullable()
                   ),
                   width: z.preprocess(
                       (val) => (String(val).trim() === "" ? undefined : val),
                       z.coerce.number().positive().optional().nullable()
                   ),
       categoryId: string().uuid().optional(), 
       stageIds: string().uuid().array().optional(),
       pricePerSquareMeter:  z.preprocess(
        (val) => (String(val).trim() === "" ? undefined : val),
        z.coerce.number().positive().optional().nullable()
    ),
    })
    super(schema)
  }
}