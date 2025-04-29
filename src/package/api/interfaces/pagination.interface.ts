
export class Pagination {
  take: number;
  skip: number;
  needPagination?: boolean;
}

export class PaginationRequest {
  page: number;
  take: number;
  needPagination: boolean = false;
}

export const paginationKeys: string[] = Object.keys(new PaginationRequest());