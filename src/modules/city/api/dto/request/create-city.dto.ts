import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { State } from 'src/database'

export class CreateCityDto {
  stateId: string
  state?: State
  name: LocalizedString
  isActive?: boolean
}