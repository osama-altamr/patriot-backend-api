import { PaginationRequest } from "@Package/api";
import { OrderPriority, OrderStatus } from "src/database/entities/order.entity";

export class GetAllOrdersDto extends PaginationRequest {
    status?: OrderStatus
    priority?: OrderPriority
    startDate?: Date
    endDate?: Date
}