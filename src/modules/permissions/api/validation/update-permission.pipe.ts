import { BaseValidationPipe } from '@Package/api';
import { string, object, boolean, nativeEnum } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; // Adjust path
import { UpdatePermissionDto } from '../dto/request/update-permission.dto';
import { PermissionAccessType, PermissionFeature } from '../enums/permission.enum';

export class UpdatePermissionValidation extends BaseValidationPipe<UpdatePermissionDto> {
  constructor() {
    const schema = object({
      accessType: nativeEnum(PermissionAccessType).optional(),
      scopes: object({
        stageId: string().optional(),
        feature: nativeEnum(PermissionFeature),
        write: boolean(),
        read: boolean(),
       }).array(),
    });
    super(schema);
  }
}