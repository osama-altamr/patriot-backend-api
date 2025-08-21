import { OrderItemStatus, Stage } from "src/database"

export class UpdateOrderItemDto {
    currentStage?: Stage | null
    currentStageId?: string | null
    status?: OrderItemStatus
    stageIds?: string[]
    stages?: Stage[]
    price?: number
}
