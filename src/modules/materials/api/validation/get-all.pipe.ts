import { Injectable } from "@nestjs/common"
import { BaseValidationPipe } from "@Package/api"
import { GetAllMaterialsDto } from "../dto/request/get-all.dto"
import { ZodValidations } from "@Package/api/validation"
import { z } from "zod"

@Injectable()
export class GetAllMaterialsValidation extends BaseValidationPipe<GetAllMaterialsDto> {
    constructor() {
        const schema = z.object({
            ...ZodValidations.paginationSchema,
            search: z.string().optional(),
        })
        super(schema)
    }
}