import { BaseValidationPipe } from '@Package/api';
import { string, object, boolean, nativeEnum} from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe';
import { UnReadNotificationsDto } from '../dto/request/unread-notification.dto';

export class UncreateNotificationsValidation extends BaseValidationPipe<UnReadNotificationsDto> {
  constructor() {
    const schema = object({
      notificationIds: string().array(),
    })
    super(schema);
  }
}