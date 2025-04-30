import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AppError } from "@Package/error";
import { CodeErrors } from "@Package/shared";
import { Observable } from "rxjs";
import {CHECK_TYPES_KEY} from "src/package/api";

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const typeHandlers = this.reflector.get<{
      values: string[];
    }>(CHECK_TYPES_KEY, context.getHandler());

    const { user } = context.switchToHttp().getRequest();
    if (!typeHandlers.values.includes(user.role))
      throw new AppError(
        {
          code: CodeErrors.WRONG_ROLE,
          message: "you are not allow to do this",
          errorType: "USER_ROLE_ERROR"
        }
      );
    return true;
  }
}
