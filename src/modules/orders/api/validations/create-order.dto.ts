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
            items:  object({
                note: string().optional(),
                productId: string().optional(),
                width: number(),
                height: number(),
                stageIds: string().array(),
                categoryId: string().optional(),
                materialId: string().optional(),
            }).array(),
            userId:  string(),
            driverId: string().optional(),
        })
        super(schema)
    }
}