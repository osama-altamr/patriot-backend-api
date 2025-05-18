
import { createParamDecorator, ExecutionContext, applyDecorators, PipeTransform, Type } from '@nestjs/common';

const Post = <T>(ValidationClass: Type<T>) => {
  return createParamDecorator((data: unknown, context: ExecutionContext) => {
    const validationInstance = new ValidationClass();
    return validationInstance;
  })();
};
const Postd = applyDecorators()