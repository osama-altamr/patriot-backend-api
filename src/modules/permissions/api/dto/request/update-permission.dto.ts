import { IScope, IStage } from "src/database"

export class UpdatePermissionDto {
  stageId: string
  stage?: IStage
  scopes: IScope[]
  accessType?: string 
}