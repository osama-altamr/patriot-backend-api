import { IAddress, OrderPriority, OrderStatus } from '../../../../database/entities/order.entity'

export class UpdateOrderDto {
    priority?: OrderPriority
    note?: string
    status?: OrderStatus
    driverId?: string
    driver?: any
    outForDeliveryAt?: Date; 
    deliveredAt?: Date;
    address?: IAddress
    total?: number
} 