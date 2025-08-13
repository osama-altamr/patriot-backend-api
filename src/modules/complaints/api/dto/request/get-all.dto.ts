import { PaginationRequest } from "@Package/api";
import { OrderPriority, OrderStatus } from "src/database/entities/order.entity";
import { ComplaintStatus } from "../../enums/complaint.enum";

export class GetAllComplaintsDto extends PaginationRequest {
    type?: string
    status?: ComplaintStatus
    startDate?: Date
    endDate?: Date
}