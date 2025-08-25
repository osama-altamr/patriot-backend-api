import { Injectable } from "@nestjs/common";
import { BaseValidationPipe } from "@Package/api";
import { ZodValidations } from "@Package/api/validation";
import { z } from "zod";
import { GetAllItemsDto } from "../dto/get-all-item.dto";

@Injectable()
export class GetAllItemsValidation extends BaseValidationPipe<GetAllItemsDto> {
    constructor() {
        const schema = z.object({
            ...ZodValidations.paginationSchema
        })
        super(schema)
    }
}   