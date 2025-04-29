import { applyDecorators, Post } from "@nestjs/common";
import { UserRole } from "/users/api/enums/user.enum";
import { AllowRole } from "./role.decorator";

export function PostPolicy(options: { path: string; role: UserRole[]}){
  return applyDecorators(
    Post(options.path),
    AllowRole(options.role)
  )
}

