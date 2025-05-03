import { object, string } from "zod"
import { RefreshDto } from "../dto/request/refresh.dto"
import { BaseValidationPipe } from "@Package/api"

export class RefreshValidation extends BaseValidationPipe<RefreshDto> {
    constructor() {
      const schema = object({
        refreshToken: string().min(1),
      })
      super(schema)
    }
  }