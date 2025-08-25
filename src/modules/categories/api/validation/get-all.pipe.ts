import { Injectable } from "@nestjs/common"
import { ZodValidations } from "@Package/api/validation"
import { z } from "zod"
import { GetAllCategoriesDto } from "../dto/request/get-all.dto"
import { BaseValidationPipe } from "@Package/api"

@Injectable()
export class GetAllCategoriesValidation extends BaseValidationPipe<GetAllCategoriesDto> {
    constructor() {
        const schema = z.object({
            ...ZodValidations.paginationSchema,
            search: z.string().optional(),
        })
        super(schema)
    }
}