import { PaginationRequest } from "@Package/api";

export class GetAllProductsDto extends PaginationRequest {
    categoryId?: string
}