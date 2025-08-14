import { IUser,  OrderItemStatus, Stage } from "src/database"

export class UpdateOrderItemDto {
    currentStage?: Stage
    currentStageId?: string
    employee?: IUser 
    status?: OrderItemStatus
}
