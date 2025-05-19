import { OrderPriority, OrderStatus } from '../../../../database/entities/order.entity'

export class UpdateOrderDto {

    priority?: OrderPriority

    note?: string

    status?: OrderStatus

    userId?: string
} 