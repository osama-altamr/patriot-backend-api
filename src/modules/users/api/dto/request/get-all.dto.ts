import { PaginationRequest } from "@Package/api";
import { UserRole } from "../../enums/user.enum";

export class GetAllUsersDto extends PaginationRequest {
    search?: string
    role?: UserRole
}