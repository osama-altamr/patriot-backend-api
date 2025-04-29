import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export abstract class BaseValidationPipe<T = any> implements PipeTransform {
  protected constructor(private readonly zSchema: ZodSchema) {}

  transform(value: T, metadata: ArgumentMetadata): T {
    const result = this.zSchema.safeParse(value);

    if (!result.success) {
      throw result.error; 
    }

    return result.data;
  }
}