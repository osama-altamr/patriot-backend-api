import { BaseValidationPipe } from '@Package/api'
import { object, string } from 'zod'
import { AddUserDto } from '../dto/request/add-user.dto'


export class AddUserValidation extends BaseValidationPipe<AddUserDto> {
  constructor() {
    const schema = object({
      name: string().optional(),
        email: string().email(),
        password: string(),
        photoUrl:  string().optional(),
        phoneNumber:  string().optional(),
    })
    super(schema)
  }
}