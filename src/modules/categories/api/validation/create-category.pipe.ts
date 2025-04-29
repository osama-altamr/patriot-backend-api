import { BaseValidationPipe } from '@Package/api';
import { string, object } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { CreateCategoryDto } from '../dto/request/create-category.dto';

export class CreateCategoryValidation extends BaseValidationPipe<CreateCategoryDto> {
  constructor() {
    const schema = object({
      name: localizedSchema,
      description: localizedSchema.optional(),
      imageUrl: string().url().optional(),
    });
    super(schema);
  }
}