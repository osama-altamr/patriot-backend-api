import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { State } from 'src/database'

export class UpdateCityDto {
  stateId?: string
  state?: State
  name?: LocalizedString
  isActive?: boolean
}