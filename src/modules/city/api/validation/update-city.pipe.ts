import { BaseValidationPipe } from '@Package/api';
import { boolean, object, string } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { UpdateCityDto } from '../dto/request/update-city.dto';

export class UpdateCityValidation extends BaseValidationPipe<UpdateCityDto> {
  constructor() {
    const schema = object({
       stateId: string().nonempty().optional(),
       name: localizedSchema.optional(),
       isActive: boolean().optional(),
    });
    super(schema);
  }
}