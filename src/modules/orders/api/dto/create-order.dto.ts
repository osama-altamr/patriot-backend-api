import { Category, Material, Stage } from 'src/database'
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
    categoryId?: string
    category?: Category
    materialId?: string
    material?: Material
    stageIds?: string[]
    stages?: Stage[]
    currentStage: Stage
    currentStageId?: string
    estimatedDeliveryTime?: Date; 
    deliveredAt?: Date;
    note?: string
}
