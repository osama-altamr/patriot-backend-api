import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function User(){
  return createParamDecorator((data: any, context:  ExecutionContext)=>{
    const req = context.switchToHttp().getRequest();
    return req?.user ?? null
  })
}