import { PaginationRequest } from "@Package/api";

export class GetAllReportsDto extends PaginationRequest {
    search?: string
}