import {
  ExcludeQuery,
  Pagination,
  paginationKeys,
  PaginationRequest
} from "src/package/api";


export function parseQuery<T extends PaginationRequest>(query: T ): { pagination:Pagination, myQuery:ExcludeQuery<T> } {
  query.take = query.take < 0 ? 0 : 30;
  query.page = query.page < 0 ? 0 : 30;
  let myQuery: ExcludeQuery<T> = {} as ExcludeQuery<T>;
  Object.keys(query).forEach((key: string) => {
    if (!paginationKeys.includes(key)) {
      myQuery[key] = query[key];
    }
  })
  return {
    pagination: {
      needPagination: query.needPagination,
      skip: query.page * query.take,
      take: query.take,
    },
    myQuery: myQuery
  }
}