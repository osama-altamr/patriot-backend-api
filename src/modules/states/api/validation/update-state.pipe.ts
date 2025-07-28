// FILE: src/api/validation/update-state.pipe.ts

import { BaseValidationPipe } from '@Package/api';
import { boolean, object } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { UpdateStateDto } from '../dto/request/update-state.dto';

export class UpdateStateValidation extends BaseValidationPipe<UpdateStateDto> {
  constructor() {
    const schema = object({
       name: localizedSchema.optional(),
       isActive: boolean().optional(),
    });
    super(schema);
  }
}