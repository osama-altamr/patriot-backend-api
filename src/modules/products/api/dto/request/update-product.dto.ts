import { LocalizedString } from '@Package/api/interfaces/localized.interface'

export class UpdateProductDto {
  name?: LocalizedString
  description?: LocalizedString
  imageUrl?: string
  height?: number
  width?: number
  categoryId?: string
}