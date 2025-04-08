import { Query } from '@nestjs/common';
import { PaginationPipe } from '@Package/api/decorators/pipes/pagination.pipe';


export function Pagination(){
  return Query(PaginationPipe)
}