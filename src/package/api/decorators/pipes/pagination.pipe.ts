import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as z from "zod"

import { IPagination } from '@Package/api';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: IPagination, metadata: ArgumentMetadata) {

    if(Object.keys(value).length !==2) {
      return {}
    }else {
      const schema = z.object({
        skip: z.coerce.number().int().min(0),
        page: z.coerce.number().int().min(1),
        limit: z.coerce.number().int().min(1),
      })
      const result = schema.safeParse(value);
      if(result.error){
        throw new BadRequestException(result.error)
      }
      return {
        skip: value.page * value.take,
        take: value.take,
      }
    }

  }
}