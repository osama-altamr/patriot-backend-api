import { IUser,  OrderItemStatus, Stage } from "src/database"

export class UpdateOrderItemDto {
    currentStage?: Stage
    currentStageId?: string
    employeeId?: string
    employee?: IUser 
    status?: OrderItemStatus
}
