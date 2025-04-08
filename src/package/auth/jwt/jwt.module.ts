import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnvironmentService } from '@Package/config';


export const JWTModule = JwtModule.registerAsync({
  inject: [EnvironmentService],
  useFactory: (envService: EnvironmentService)=>{
    return {
      secret: envService.get("jwt.jwtAccessToken"),
      signOptions: {
        expiresIn: envService.get("jwt.jwtExpiredAccess"),
      }
    }
  }
})
