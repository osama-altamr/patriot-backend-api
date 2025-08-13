import { IScope, IStage, IUser } from 'src/database' // Adjust path
import { PermissionAccessType } from '../../enums/permission.enum'

export class CreatePermissionDto {
  userId: string
  user?: IUser
  stageId: string
  stage?: IStage
  scopes: IScope[]
  accessType: PermissionAccessType
}