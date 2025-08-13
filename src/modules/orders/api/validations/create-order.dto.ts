import { CreateOrderDto } from "../dto/create-order.dto";
import { BaseValidationPipe } from '@Package/api';
import { OrderPriority, OrderType } from "src/database/entities/order.entity";
import { object, string, number, nativeEnum } from 'zod';

export class CreateOrderValidation extends BaseValidationPipe<CreateOrderDto> {
    constructor() {
        const schema = object({
            note: string().optional(),
            type: nativeEnum(OrderType).optional(),
            priority: nativeEnum(OrderPriority).optional(),
            address: object({
                stateId: string().min(1, 'State ID is required'),
                cityId: string().optional(),
                street1: string().min(1, 'Street address is required'),
                street2: string().optional(),
                postalCode: string().optional(),
                apartment: string().optional(),
                complex: string().optional(),
               }),
            items: object({
                note: string().optional(),
                productId: string().min(1, 'Product ID is required'),
                width: number().positive('Width must be positive'),
                height: number().positive('Height must be positive'),
                categoryId: string().optional(),
                materialId: string().optional(),
                currentStageId: string().optional(),
            }).array().min(1, 'At least one item is required'),
            userId: string().min(1, 'User ID is required'),
            driverId: string().optional(),
        })
        super(schema)
    }
}