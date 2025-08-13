
import { LocalizedString } from '@Package/api/interfaces/localized.interface'

export class UpdateStateDto {
  name: LocalizedString
  isActive?: boolean
}