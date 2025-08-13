import { BaseValidationPipe } from '@Package/api'
import { object, string } from 'zod'
import { UpdatePasswordDto } from '../dto/request/update-password.dto'

export class UpdatePasswordValidation extends BaseValidationPipe<UpdatePasswordDto> {
  constructor() {
    const schema = object({
        currentPassword: string(),
        newPassword: string(),
    })
    super(schema)
  }
}