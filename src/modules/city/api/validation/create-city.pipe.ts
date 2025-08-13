// FILE: src/api/validation/create-city.pipe.ts

import { BaseValidationPipe } from '@Package/api';
import { boolean, object, string } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { CreateCityDto } from '../dto/request/create-city.dto';

export class CreateCityValidation extends BaseValidationPipe<CreateCityDto> {
  constructor() {
    const schema = object({
      stateId: string().nonempty(), 
      name: localizedSchema,
      isActive: boolean().optional(),
    });
    super(schema);
  }
}