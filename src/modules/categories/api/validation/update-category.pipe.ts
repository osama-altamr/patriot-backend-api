import { BaseValidationPipe } from '@Package/api';
import { string, object } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { UpdateCategoryDto } from '../dto/request/update-category.dto';

export class UpdateCategoryValidation extends BaseValidationPipe<UpdateCategoryDto> {
  constructor() {
    const schema = object({
       name: localizedSchema.optional(),
       description: localizedSchema.optional(),
       imageUrl: string().url().optional().nullable(),
    });
    super(schema);
  }
}