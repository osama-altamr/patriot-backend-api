import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyConstant } from '@Package/auth/passport/strategy/strategy.constant';
import { EnvironmentService } from '@Package/config';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, StrategyConstant.jwt) {

  constructor(
    private readonly environmentService: EnvironmentService,
  ) {
    const secretKey = environmentService.get('jwt.jwtAccessToken');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
      passReqToCallback: true,
    });

  }

  validate(req: Request, payload: any) {
    console.log("payload :",payload);
    return payload
  }

}