import { useEffect, useRef, useState } from 'react'

export interface PaginatedData<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

interface UsePaginationOptions<T> {
  initialData: T[]
  initialNextCursor: string | null
  initialHasMore: boolean
  pageSize?: number
  fetchPage: (pageSize: number, cursor?: string) => Promise<{ success: true } & PaginatedData<T> | { success: false; error: string }>
  onPageChange?: (newData: T[]) => void // optional callback e.g. to reset statuses
}

export function usePagination<T>({
  initialData,
  initialNextCursor,
  initialHasMore,
  pageSize = 5,
  fetchPage,
  onPageChange,
}: UsePaginationOptions<T>) {
  const [data, setData] = useState<T[]>(initialData)
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null])
  const [currentPage, setCurrentPage] = useState(0)
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    // initialData changed (router.refresh() completed) — reset to page 0 with fresh data
    setData(initialData)
    setNextCursor(initialNextCursor)
    setHasMore(initialHasMore)
    setCurrentPage(0)
    setCursorHistory([null])
    onPageChange?.(initialData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  const applyPage = (newData: T[]) => {
    setData(newData)
    onPageChange?.(newData)
  }

  const handleNext = async () => {
    if (!nextCursor || loading) return
    setLoading(true)
    const response = await fetchPage(pageSize, nextCursor)
    if (response.success) {
      applyPage(response.data)
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      setCursorHistory(prev => {
        const updated = [...prev]
        updated[newPage] = nextCursor
        return updated
      })
      setNextCursor(response.nextCursor)
      setHasMore(response.hasMore)
    }
    setLoading(false)
  }

  const handlePrevious = async () => {
    if (currentPage === 0 || loading) return
    setLoading(true)
    const prevPage = currentPage - 1
    const prevCursor = cursorHistory[prevPage] ?? undefined
    const response = await fetchPage(pageSize, prevCursor)
    if (response.success) {
      applyPage(response.data)
      setCurrentPage(prevPage)
      setNextCursor(cursorHistory[currentPage])
      setHasMore(true)
    }
    setLoading(false)
  }

  // Called by external code to fully reset state (e.g. after filters change)
  const resetToData = (
    newData: T[],
    newNextCursor: string | null,
    newHasMore: boolean
  ) => {
    setData(newData)
    setNextCursor(newNextCursor)
    setHasMore(newHasMore)
    setCurrentPage(0)
    setCursorHistory([null])
    onPageChange?.(newData)
  }

  return {
    data,
    currentPage,
    hasMore,
    loading,
    handleNext,
    handlePrevious,
    resetToData
  }
}