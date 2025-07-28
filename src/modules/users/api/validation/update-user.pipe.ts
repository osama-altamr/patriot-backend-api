import { BaseValidationPipe } from '@Package/api'
import { nativeEnum, object, string } from 'zod'
import { AddUserDto } from '../dto/request/add-user.dto'
import { UserRole } from '../enums/user.enum'


export class UpdateUserValidation extends BaseValidationPipe<AddUserDto> {
  constructor() {
    const schema = object({
      name: string().optional(),
        email: string().email().optional(),
        photoUrl:  string().optional(),
        phoneNumber:  string().optional(),
        fcmToken: string().optional(),
        address: object({
          stateId: string(),
          cityId: string().optional(),
          street1: string(),
          street2: string().optional(),
          postalCode: string().optional(),
          apartment: string().optional(),
          complex: string().optional(),
         })
    })
    super(schema)
  }
}

export class UpdateUserForAdminValidation extends BaseValidationPipe<AddUserDto> {
  constructor() {
    const schema = object({
        name: string().optional(),
        email: string().email().optional(),
        password: string().optional(),
        photoUrl:  string().optional(),
        phoneNumber:  string().optional(),
        fcmToken: string().optional(),
        role: nativeEnum(UserRole),
        address: object({
          stateId: string(),
          cityId: string().optional(),
          street1: string(),
          street2: string().optional(),
          postalCode: string().optional(),
          apartment: string().optional(),
          complex: string().optional(),
         })
    })
    super(schema)
  }
}