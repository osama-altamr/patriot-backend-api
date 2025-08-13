import { Category, Material, Stage } from 'src/database'
import { IAddress, OrderPriority, OrderStatus, OrderType } from '../../../../database/entities/order.entity'

export class CreateOrderDto {
    priority: OrderPriority
    type: OrderType
    note?: string
    status?: OrderStatus
    userId?: string
    driverId?: string
    items: CreateOrderItemDto[]
    address: IAddress
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
    outForDeliveryAt?: Date; 
    deliveredAt?: Date;
    note?: string
}
