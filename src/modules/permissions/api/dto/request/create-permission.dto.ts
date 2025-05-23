import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { IPermission, IUser } from 'src/database' // Adjust path
import { PermissionAccessType, PermissionFeature } from '../../enums/permission.enum'

export class CreatePermissionDto implements Omit<IPermission, 'id' | 'user'> {
  write: boolean 
  read: boolean  
  userId: string
  user?: IUser
  feature: PermissionFeature
  accessType: PermissionAccessType
}