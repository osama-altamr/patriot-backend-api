import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@Package/auth';

export function AuthController (options: {
  prefix: string
}){
  return applyDecorators(
    Controller({path: options.prefix}),
    UseGuards(JwtAuthGuard)
  )
}