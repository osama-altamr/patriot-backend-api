import { applyDecorators } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { UserRoleGuard } from '@Package/auth/guards';
import {UserRoleMetadata} from "src/package/api";
import { UserRole } from '/users/api/enums/user.enum';

export function AllowRole(values: UserRole[]) {
  return applyDecorators(
    UserRoleMetadata(values),
    UseGuards(UserRoleGuard),
  );
}
