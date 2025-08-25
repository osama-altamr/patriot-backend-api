import { Injectable } from "@nestjs/common"
import { BaseValidationPipe } from "@Package/api"
import { z } from "zod"
import { GetAllStatesDto } from "../dto/request/get-all.dto"
import { ZodValidations } from "@Package/api/validation"

@Injectable()
export class GetAllStatesValidation extends BaseValidationPipe<GetAllStatesDto> {
    constructor() {
        const schema = z.object({
            ...ZodValidations.paginationSchema,
            search: z.string().optional(),
        })
        super(schema)
    }
}   