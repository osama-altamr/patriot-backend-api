import * as z from "zod"

export class ZodValidations{
    static paginationSchema = {
        page: z.coerce.number().int().min(0),
        limit: z.coerce.number().int().min(1),
    }
}