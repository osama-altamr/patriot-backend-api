import { BaseValidationPipe } from '@Package/api';
import { string, object } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { CreateMediaFileDto } from '../dto/request/create-media-file.dto';

export class CreateMediaFileValidation extends BaseValidationPipe<CreateMediaFileDto> {
  constructor() {
    const schema = object({
      userId: string(),
      fileName: string(),
      contentType: string(),
    });
    super(schema);
  }
}