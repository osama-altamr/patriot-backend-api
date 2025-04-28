import { BaseValidationPipe } from '@Package/api'
import { object, string } from 'zod'
import { AddUserDto } from '../dto/request/add-user.dto'


export class UpdateUserValidation extends BaseValidationPipe<AddUserDto> {
  constructor() {
    const schema = object({
      name: string().optional(),
        email: string().email().optional(),
        password: string().optional(),
        photoUrl:  string().optional(),
        phoneNumber:  string().optional(),
        fcmToken: string().optional(),
    })
    super(schema)
  }
}