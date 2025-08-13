import { BaseValidationPipe } from '@Package/api'
import { string, object, number } from 'zod'
import { localizedSchema } from '@Package/api/pipes/localized.pipe' 
import { UpdateProductDto } from '../dto/request/update-product.dto'

export class UpdateProductValidation extends BaseValidationPipe<UpdateProductDto> {
  constructor() {
    const schema = object({
       name: localizedSchema.optional(),
       description: localizedSchema.optional(),
       imageUrl: string().url().optional().nullable(), 
       height: number().positive().optional().nullable(), 
       width: number().positive().optional().nullable(), 
       categoryId: string().uuid().optional(), 
       stageIds: string().uuid().array(), 
    })
    super(schema)
  }
}