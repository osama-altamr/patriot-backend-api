import { BaseValidationPipe } from '@Package/api'
import { object, string } from 'zod'
import { AddUserDto } from '../dto/request/add-user.dto'


export class AddUserValidation extends BaseValidationPipe<AddUserDto> {
  constructor() {
    const schema = object({
        email: string().email(),
        password: string(),
    })
    super(schema)
  }
}