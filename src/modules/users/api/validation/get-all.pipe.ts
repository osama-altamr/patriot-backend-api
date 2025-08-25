import { z } from "zod"
import { BaseValidationPipe } from "@Package/api"
import { GetAllUsersDto } from "../dto/request/get-all.dto"
import { ZodValidations } from "@Package/api/validation"
import { Injectable } from "@nestjs/common"
import { UserRole } from "../enums/user.enum"

@Injectable()
export class GetAllUsersValidation extends BaseValidationPipe<GetAllUsersDto> {
    constructor() {
        const schema = z.object({
            ...ZodValidations.paginationSchema,
            search: z.string().optional(),
            role: z.nativeEnum(UserRole).optional(),
            })
        super(schema)
    }
}