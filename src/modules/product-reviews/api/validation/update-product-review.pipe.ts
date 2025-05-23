import { BaseValidationPipe } from '@Package/api'
import { string, object, number } from 'zod'
import { localizedSchema } from '@Package/api/pipes/localized.pipe' 
import { UpdateProductReviewDto } from '../dto/request/update-product-review.dto'

export class UpdateProductValidation extends BaseValidationPipe<UpdateProductReviewDto> {
  constructor() {
    const schema = object({
      title: string().optional(),
      comment: string().optional(),
      rating: number().min(1).max(5).optional(),
    })
    super(schema)
  }
}