import { z } from "zod"
import { BaseValidationPipe } from "@Package/api"
import { GetAllReportsDto } from "../dto/request/get-all.dto"
import { ZodValidations } from "@Package/api/validation"
import { Injectable } from "@nestjs/common"

@Injectable()
export class GetAllReportsValidation extends BaseValidationPipe<GetAllReportsDto> {
    constructor() {
        const schema = z.object({
            ...ZodValidations.paginationSchema,
            })
        super(schema)
    }
}