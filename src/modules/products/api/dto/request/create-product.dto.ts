import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { IProduct, Stage } from 'src/database'

export class CreateProductDto {
  name: LocalizedString
  description?: LocalizedString
  imageUrl?: string
  height?: number
  width?: number
  categoryId: string 
  stageIds?: string[]
  stages?: Stage[]
}