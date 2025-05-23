import { BaseValidationPipe } from '@Package/api'
import { object, string } from 'zod'
import { ForgotPasswordDto } from '../dto/request/forgot-password.dto'

export class ForgotPasswordValidation extends BaseValidationPipe<ForgotPasswordDto> {
  constructor() {
    const schema = object({
        email: string().email(),
    })
    super(schema)
  }
}