import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { ICategory } from 'src/database' // Adjust path

export class CreateCategoryDto implements Omit<ICategory, 'id'> {
  name: LocalizedString
  description?: LocalizedString
  imageUrl?: string
}