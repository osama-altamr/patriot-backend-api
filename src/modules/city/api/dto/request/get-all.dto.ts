import { PaginationRequest } from "@Package/api";

export class GetAllCitiesDto extends PaginationRequest {
    startDate?: Date
    endDate?: Date
    stateId?: string
    search?: string
}