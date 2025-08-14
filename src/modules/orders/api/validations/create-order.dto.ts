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
                stateId: string(),
                cityId: string().optional(),
                street1: string(),
                street2: string().optional(),
                postalCode: string().optional(),
                apartment: string().optional(),
                complex: string().optional(),
               }),
            items:  object({
                note: string().optional(),
                productId: string().optional(),
                width: number(),
                height: number(),
                categoryId: string().optional().nullable(),
                materialId: string().optional().nullable(),
            }).array(),
            userId:  string(),
            driverId: string().optional().nullable(),
        })
        super(schema)
    }
}