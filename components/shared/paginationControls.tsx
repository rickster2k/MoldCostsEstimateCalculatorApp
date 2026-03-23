interface PaginationControlsProps {
  currentPage: number
  hasMore: boolean
  loading: boolean
  onNext: () => void
  onPrevious: () => void
}

export default function PaginationControls({
  currentPage,
  hasMore,
  loading,
  onNext,
  onPrevious,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
      <button
        onClick={onPrevious}
        disabled={currentPage === 0 || loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Previous
      </button>

      <span className="text-sm text-slate-400 font-medium">Page {currentPage + 1}</span>

      <button
        onClick={onNext}
        disabled={!hasMore || loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}