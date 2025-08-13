import { BaseValidationPipe } from '@Package/api'
import { object, string } from 'zod'
import { ResetPasswordDto } from '../dto/request/reset-password.dto'

export class ResetPasswordValidation extends BaseValidationPipe<ResetPasswordDto> {
  constructor() {
    const schema = object({
        email: string().email(),
        code: string(),
        password: string(),
    })
    super(schema)
  }
}