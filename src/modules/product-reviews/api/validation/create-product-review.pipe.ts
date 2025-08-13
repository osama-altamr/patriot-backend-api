import { BaseValidationPipe } from '@Package/api';
import { string, object, number } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; 
import { CreateProductReviewDto } from '../dto/request/create-product-review.dto';

export class CreateProductReviewValidation extends BaseValidationPipe<CreateProductReviewDto> {
  constructor() {
    const schema = object({
     title: string().optional(),
     comment: string().optional(),
     rating: number().min(1).max(5).optional(),
     productId: string(),
    })
    super(schema)
  }
}