import { SetMetadata } from "@nestjs/common";
import { UserRole } from "/users/api/enums/user.enum";

export const CHECK_TYPES_KEY = "userType";
export const UserRoleMetadata = (values: UserRole[]) =>
  SetMetadata(CHECK_TYPES_KEY, { values });
