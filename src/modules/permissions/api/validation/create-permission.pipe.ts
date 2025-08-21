import { BaseValidationPipe } from '@Package/api';
import { string, object, boolean, nativeEnum} from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { CreatePermissionDto } from '../dto/request/create-permission.dto';
import { PermissionAccessType, PermissionFeature } from '../enums/permission.enum';

export class CreatePermissionValidation extends BaseValidationPipe<CreatePermissionDto> {
  constructor() {
    const schema = object({
       scopes: object({
        feature: nativeEnum(PermissionFeature),
        write: boolean(),
        read: boolean(),
       }).array(),
      stageId: string().optional().nullable(),
      accessType: nativeEnum(PermissionAccessType),
      userId: string(),
    });
    super(schema);
  }
}