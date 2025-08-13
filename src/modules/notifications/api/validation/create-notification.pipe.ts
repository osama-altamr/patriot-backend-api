import { BaseValidationPipe } from '@Package/api';
import { string, object, boolean, nativeEnum} from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { CreateNotificationDto } from '../dto/request/create-notification.dto';

export class CreatePermissionValidation extends BaseValidationPipe<CreateNotificationDto> {
  constructor() {
    const schema = object({
    title: localizedSchema,
    content: localizedSchema,
    isSeen: boolean(),
    type: string(),
    recordId: string(),
    userId: string(),
    })
    super(schema);
  }
}