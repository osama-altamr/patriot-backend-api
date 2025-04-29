import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { IProduct } from 'src/database'

export class CreateProductDto implements Omit<IProduct, 'id' | 'category'> {
  name: LocalizedString
  description?: LocalizedString
  imageUrl?: string
  height?: number
  width?: number
  categoryId: string 
}