import { IUser } from 'src/database'
import { OrderPriority, OrderStatus } from '../../../../database/entities/order.entity'

export class UpdateOrderDto {
    priority?: OrderPriority
    note?: string
    status?: OrderStatus
    driverId?: string
    driver?: any
} 