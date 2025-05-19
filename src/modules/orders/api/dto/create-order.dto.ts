import { OrderPriority, OrderStatus } from '../../../../database/entities/order.entity'

export class CreateOrderDto {

    priority: OrderPriority

    note?: string

    status?: OrderStatus

    userId?: string

    items: CreateOrderItemDto[]
} 

export class CreateOrderItemDto {
    productId: string
    width: number
    height: number
}