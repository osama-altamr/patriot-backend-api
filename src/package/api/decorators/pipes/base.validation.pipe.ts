import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export abstract class BaseValidationPipe<T = any> implements PipeTransform {

  protected constructor(private zSchema: ZodSchema) {
  }
  transform(value: T, metadata: ArgumentMetadata): any {
    const result = this.zSchema.safeParse(value)
    if(result.error){
      throw new ZodError(result.error.issues)
    }
    return result.data;
  }

}