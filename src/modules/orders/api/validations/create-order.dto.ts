import { CreateOrderDto } from "../dto/create-order.dto";
import { BaseValidationPipe } from '@Package/api';
import { object, string, z } from 'zod';

export class CreateOrderValidation extends BaseValidationPipe<CreateOrderDto> {
    constructor() {
        const schema = object({
            note: string().optional(),
            items: z.array(z.object({
                productId: z.string(),
                width: z.number(),
                height: z.number(),
            })),
        })
        super(schema)
    }
}