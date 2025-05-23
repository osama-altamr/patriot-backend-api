import { CreateOrderDto } from "../dto/create-order.dto";
import { BaseValidationPipe } from '@Package/api';
import { object, string } from 'zod';
import { VerifyOrderCodeDto } from "../dto/verify-order-code.dto";

export class VerifyOrderValidation extends BaseValidationPipe<VerifyOrderCodeDto> {
    constructor() {
        const schema = object({
            code: string(),
        })
        super(schema)
    }
}