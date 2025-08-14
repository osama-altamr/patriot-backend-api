import { CreateOrderDto } from "../dto/create-order.dto";
import { BaseValidationPipe } from '@Package/api';
import { object, string } from 'zod';
import { SendOrderCodeDto } from "../dto/send-order-code.dto";

export class SendOrderCodeValidation extends BaseValidationPipe<SendOrderCodeDto> {
    constructor() {
        const schema = object({
            userId: string(),
        })
        super(schema)
    }
}