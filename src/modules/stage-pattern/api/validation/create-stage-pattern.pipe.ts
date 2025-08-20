import { BaseValidationPipe } from '@Package/api';
import { object, string } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe';
import { CreateStagePatternDto } from '../dto/request/create-stage-pattern.dto';

export class CreateStagePatternValidation extends BaseValidationPipe<CreateStagePatternDto> {
  constructor() {
    const schema = object({
      stageId: string().uuid({ message: 'Stage ID must be a valid UUID.' }),
      title: localizedSchema,
      imageUrl: string().url({ message: 'Image URL must be a valid URL.' }).optional().nullable(),
    });
    super(schema);
  }
}