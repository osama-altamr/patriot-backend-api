import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyConstant } from '@Package/auth/passport/strategy/strategy.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyConstant.jwt) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: unknown, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    Logger.debug({user}, 'Handle Requesstttttttttttttttt')
    return user
  }
  
}