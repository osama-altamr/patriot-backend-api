import { PaginationRequest } from "@Package/api";


export class GetAllCategoriesDto extends PaginationRequest {
    search?: string
}