import { IUser,  Material,  OrderItemStatus, Stage } from "src/database"

export class GlassCuttingDto {
    materialId?: string
    type: 'order' | 'item'
    width?: number
    height?: number
}
