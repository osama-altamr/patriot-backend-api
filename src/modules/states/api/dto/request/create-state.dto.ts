// FILE: src/api/dto/request/create-state.dto.ts

import { LocalizedString } from '@Package/api/interfaces/localized.interface'

export class CreateStateDto {
  name: LocalizedString
  isActive?: boolean
}