import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { ICategory } from 'src/database' // Adjust path

export class CreateMediaFileDto {
  userId: string
  fileName: string
  contentType: string
}