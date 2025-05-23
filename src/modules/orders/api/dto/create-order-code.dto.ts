import { IOrder, IUser } from "src/database"

export class CreateOrderCodeDto {
    order: IOrder
    user: IUser
    code?: string
    expiresAt?: Date
} 
