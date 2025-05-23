import { BaseValidationPipe } from '@Package/api';
import { string, object, boolean, nativeEnum } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { UpdatePermissionDto } from '../dto/request/update-permission.dto';
import { PermissionAccessType, PermissionFeature } from '../enums/permission.enum';

export class UpdatePermissionValidation extends BaseValidationPipe<UpdatePermissionDto> {
  constructor() {
    const schema = object({
      feature: nativeEnum(PermissionFeature).optional(),
      accessType: nativeEnum(PermissionAccessType).optional(),
      write: boolean().optional(),
      read: boolean().optional(),
    });
    super(schema);
  }
}