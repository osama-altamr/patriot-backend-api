import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { IPermission, IScope, IUser } from 'src/database' // Adjust path
import { PermissionAccessType, PermissionFeature } from '../../enums/permission.enum'

export class CreatePermissionDto implements Omit<IPermission, 'id' | 'user'> {
  userId: string
  user?: IUser
  scopes: IScope[]
  accessType: PermissionAccessType
}