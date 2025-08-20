import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { Category, Stage } from 'src/database'

export class UpdateProductDto {
  name?: LocalizedString
  description?: LocalizedString
  imageUrl?: string
  height?: number
  width?: number
  categoryId?: string
  category?: Category
  stageIds?: string[]
  stages?: Stage[]
  pricePerSquareMeter?: number
}