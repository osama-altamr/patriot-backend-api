import { IScope } from "src/database"

export class UpdatePermissionDto {
 scopes: IScope[]
  accessType?: string 
}