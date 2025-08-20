import { BaseValidationPipe } from '@Package/api';
import { object, string } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe';
import { UpdateStagePatternDto } from '../dto/request/update-stage-pattern.dto';

export class UpdateStagePatternValidation extends BaseValidationPipe<UpdateStagePatternDto> {
  constructor() {
    const schema = object({
      title: localizedSchema.optional(),
      imageUrl: string().url({ message: 'Image URL must be a valid URL.' }).optional().nullable(),
    });
    super(schema);
  }
}