import { Stage } from 'src/database'
import { OrderPriority, OrderStatus, OrderType } from '../../../../database/entities/order.entity'

export class CreateOrderDto {
    priority: OrderPriority
    type: OrderType
    note?: string
    status?: OrderStatus
    userId?: string
    driverId?: string
    items: CreateOrderItemDto[]
} 

export class CreateOrderItemDto {
    width: number
    height: number
    productId?: string
    materialId?: string
    stageIds?: string[]
    stages?: Stage[]
    currentStage: Stage
    currentStageId?: string
}
