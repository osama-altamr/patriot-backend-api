import { BaseValidationPipe } from '@Package/api';
import { string, object, number } from 'zod';
import { CreateStageDto } from '../dto/request/create-stage.dto';
import { localizedSchema } from '@Package/api/pipes/localized.pipe';
import {  } from 'joi';

export class CreateStageValidation extends BaseValidationPipe<CreateStageDto> {
  constructor() {
    const schema = object({
       name: localizedSchema,
       description: localizedSchema.optional(),
       imageUrl: string().optional(),
       estimatedTimeMinutes: number().optional(),
       order: number().optional(),
    })
    super(schema)
  }
}