import { LocalizedString } from '@Package/api/interfaces/localized.interface'

export class UpdateCategoryDto {
  name?: LocalizedString
  description?: LocalizedString
  imageUrl?: string
}