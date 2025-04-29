import { BaseValidationPipe } from '@Package/api';
import { string, object, number } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; 
import { CreateProductDto } from '../dto/request/create-product.dto';

export class CreateProductValidation extends BaseValidationPipe<CreateProductDto> {
  constructor() {
    const schema = object({
      name: localizedSchema, 
      description: localizedSchema.optional(),
      imageUrl: string().url().optional(), 
      height: number().positive().optional(), 
      width: number().positive().optional(), 
      categoryId: string().uuid(), 
    })
    super(schema)
  }
}