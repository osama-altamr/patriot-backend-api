import { BaseValidationPipe } from '@Package/api';
import { string, object, boolean, nativeEnum } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { UpdateNotificationDto } from '../dto/request/update-notification.dto';

export class UpdateNotificationValidation extends BaseValidationPipe<UpdateNotificationDto> {
  constructor() {
    const schema = object({
      title: localizedSchema.optional(),
      content: localizedSchema.optional(),
      isSeen: boolean().optional(),
      type: string().optional(),
      recordId: string().optional(),
    });
    super(schema);
  }
}
