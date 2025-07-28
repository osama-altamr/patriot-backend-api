// FILE: src/api/validation/create-state.pipe.ts

import { BaseValidationPipe } from '@Package/api';
import { boolean, object } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { CreateStateDto } from '../dto/request/create-state.dto';

export class CreateStateValidation extends BaseValidationPipe<CreateStateDto> {
  constructor() {
    const schema = object({
      name: localizedSchema,
      isActive: boolean().optional(),
    });
    super(schema);
  }
}