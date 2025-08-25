import { Injectable } from "@nestjs/common"
import { BaseValidationPipe } from "@Package/api"
import { GetAllCitiesDto } from "../dto/request/get-all.dto"
import { ZodValidations } from "@Package/api/validation"
import { z } from "zod"

@Injectable()
export class GetAllCitiesValidation extends BaseValidationPipe<GetAllCitiesDto> {
    constructor() {
        const schema = z.object({
            ...ZodValidations.paginationSchema,
            endDate: z.coerce.date().optional(),
            startDate: z.coerce.date().optional(),
            stateId: z.string().optional(),
            search: z.string().optional(),
        })
        super(schema)
    }
}