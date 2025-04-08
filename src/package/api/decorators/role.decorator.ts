import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

export function UserRole(...roles: string[]){
  return createParamDecorator((data: any, context: ExecutionContext)=>{
    const req = context.switchToHttp().getRequest();
    if(!roles.includes(req.user.role)){
      throw new HttpException('Role Not Found', HttpStatus.NOT_FOUND);
    }
    return;
  })
}