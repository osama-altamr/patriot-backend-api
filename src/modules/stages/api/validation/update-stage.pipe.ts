import { BaseValidationPipe } from '@Package/api';
import { string, object, number } from 'zod';
import { CreateStageDto } from '../dto/request/create-stage.dto';
import { localizedSchema } from '@Package/api/pipes/localized.pipe';
import { UpdateStageDto } from '../dto/request/update-stage.dto';

export class UpdateStageValidation extends BaseValidationPipe<UpdateStageDto> {
  constructor() {
    const schema = object({
       name: localizedSchema.optional(),
       description: localizedSchema.optional(),
       imageUrl: string().optional(),
       estimatedTimeMinutes: number().optional(),
    })
    super(schema)
  }
}