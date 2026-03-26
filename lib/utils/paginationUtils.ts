// lib/utils/paginationUtils.ts

import { Query, DocumentSnapshot } from 'firebase-admin/firestore'

export const DEFAULT_PAGE_SIZE = 10

export interface PaginatedResult<T> {
  data: T[]
  nextCursor: string | null  // doc ID of last item, used to fetch next page
  hasMore: boolean
  total?: number
}

export function applyPagination(
  query: Query,
  pageSize: number = DEFAULT_PAGE_SIZE,
  cursor?: DocumentSnapshot
): Query {
  let q = query.limit(pageSize + 1) // fetch one extra to detect hasMore
  if (cursor) q = q.startAfter(cursor)
  return q
}

export function buildPaginatedResult<T>(
  docs: DocumentSnapshot[],
  pageSize: number,
  mapFn: (doc: DocumentSnapshot) => T
): PaginatedResult<T> {
  const hasMore = docs.length > pageSize
  const sliced = hasMore ? docs.slice(0, pageSize) : docs
  return {
    data: sliced.map(mapFn),
    nextCursor: sliced.length > 0 ? sliced[sliced.length - 1].id : null,
    hasMore,
  }
}