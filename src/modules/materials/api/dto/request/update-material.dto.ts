import { LocalizedString } from "@Package/api";
import { MaterialType } from "../../enums/material.enum";

export class UpdateMaterialDto {
  name?: LocalizedString
  description?: LocalizedString
  imageUrl?: string
  height?: number
  width?: number
  quantity?: number
  type: MaterialType
  location?: string
}