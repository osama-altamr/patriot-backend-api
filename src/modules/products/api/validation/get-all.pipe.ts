import { Injectable } from "@nestjs/common"
import { ZodValidations } from "@Package/api/validation"
import { z } from "zod"
import { GetAllProductsDto } from "../dto/request/get-all.dto"
import { BaseValidationPipe } from "@Package/api"

@Injectable()
export class GetAllProductsValidation extends BaseValidationPipe<GetAllProductsDto> {
    constructor() {
        const schema = z.object({
            ...ZodValidations.paginationSchema,
            categoryId: z.string().optional(),
        })
        super(schema)
    }
}